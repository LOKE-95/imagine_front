/**
 * SupplyLens - Vendor Risk Intelligence Dashboard
 * Main Application JavaScript
 */

// ============================================
// Configuration
// ============================================

// Auto-detect API URL based on environment
// For production: Update PRODUCTION_API_URL with your Azure App Service URL
const PRODUCTION_API_URL = 'https://supplylens-api.azurewebsites.net/api';
const LOCAL_API_URL = 'http://localhost:8080/api';

const CONFIG = {
    // Auto-detect production vs local environment
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? LOCAL_API_URL
        : 'https://supplylens.azurewebsites.net/api',
    REFRESH_INTERVAL: 30000, // 30 seconds
    TOAST_DURATION: 4000
};

// ============================================
// State Management
// ============================================
const state = {
    vendors: [],
    decisions: [],
    currentPage: 'dashboard',
    selectedVendor: null,
    isLoading: false,
    apiConnected: false
};

// ============================================
// API Client
// ============================================
const api = {
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },

    // Vendors
    async getVendors() {
        return this.request('/vendors');
    },

    async getVendor(vendorId) {
        return this.request(`/vendors/${vendorId}`);
    },

    async createVendor(data) {
        return this.request('/vendors', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // Risk
    async getVendorRisk(vendorId) {
        return this.request(`/vendors/${vendorId}/risk`);
    },

    async triggerAssessment(vendorId) {
        return this.request(`/vendors/${vendorId}/assess`, {
            method: 'POST'
        });
    },

    async getRiskHistory(vendorId) {
        return this.request(`/vendors/${vendorId}/history`);
    },

    // Decisions
    async getDecisions() {
        return this.request('/decisions');
    },

    async logDecision(data) {
        return this.request('/decisions', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // Health
    async checkHealth() {
        return this.request('/health');
    }
};

// ============================================
// UI Utilities
// ============================================
const ui = {
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success' ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' :
                type === 'error' ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' :
                    type === 'warning' ? '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' :
                        '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'}
            </svg>
            <span>${message}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, CONFIG.TOAST_DURATION);
    },

    showModal(content) {
        const overlay = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = content;
        overlay.classList.remove('hidden');

        overlay.onclick = (e) => {
            if (e.target === overlay) this.hideModal();
        };
    },

    hideModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return this.formatDate(dateString);
    },

    getRiskColor(level) {
        const colors = {
            HIGH: 'high',
            MEDIUM: 'medium',
            LOW: 'low'
        };
        return colors[level] || 'low';
    },

    setLoading(isLoading) {
        state.isLoading = isLoading;
        // Could add global loading indicator here
    }
};

// ============================================
// Page Renderers
// ============================================
const pages = {
    // Dashboard Page
    async dashboard() {
        document.getElementById('page-title').textContent = 'Dashboard';
        document.getElementById('page-subtitle').textContent = 'Vendor risk intelligence overview';

        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="stats-grid" id="stats-grid">
                <div class="skeleton" style="height: 120px;"></div>
                <div class="skeleton" style="height: 120px;"></div>
                <div class="skeleton" style="height: 120px;"></div>
                <div class="skeleton" style="height: 120px;"></div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Recent Vendors</h3>
                    <button class="btn btn-secondary" onclick="router.navigate('vendors')">View All</button>
                </div>
                <div class="card-body" id="recent-vendors">
                    <div class="skeleton skeleton-text" style="width: 100%;"></div>
                    <div class="skeleton skeleton-text" style="width: 80%;"></div>
                    <div class="skeleton skeleton-text" style="width: 90%;"></div>
                </div>
            </div>
        `;

        try {
            const vendors = await api.getVendors();
            state.vendors = vendors;
            this.renderDashboardStats(vendors);
            this.renderRecentVendors(vendors.slice(0, 5));
        } catch (error) {
            ui.showToast('Failed to load dashboard data', 'error');
            this.renderDashboardStats([]);
            this.renderRecentVendors([]);
        }
    },

    renderDashboardStats(vendors) {
        const highRisk = vendors.filter(v => v.latestRisk?.riskLevel === 'HIGH').length;
        const mediumRisk = vendors.filter(v => v.latestRisk?.riskLevel === 'MEDIUM').length;
        const lowRisk = vendors.filter(v => v.latestRisk?.riskLevel === 'LOW').length;

        document.getElementById('stats-grid').innerHTML = `
            <div class="stat-card accent">
                <div class="stat-label">Total Vendors</div>
                <div class="stat-value">${vendors.length}</div>
                <div class="stat-change">Monitored continuously</div>
            </div>
            <div class="stat-card high">
                <div class="stat-label">High Risk</div>
                <div class="stat-value">${highRisk}</div>
                <div class="stat-change ${highRisk > 0 ? 'negative' : 'positive'}">
                    ${highRisk > 0 ? 'Requires attention' : 'All clear'}
                </div>
            </div>
            <div class="stat-card medium">
                <div class="stat-label">Medium Risk</div>
                <div class="stat-value">${mediumRisk}</div>
                <div class="stat-change">Review recommended</div>
            </div>
            <div class="stat-card low">
                <div class="stat-label">Low Risk</div>
                <div class="stat-value">${lowRisk}</div>
                <div class="stat-change positive">Within tolerance</div>
            </div>
        `;
    },

    renderRecentVendors(vendors) {
        const container = document.getElementById('recent-vendors');

        if (vendors.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M17 21V19C17 16.79 15.21 15 13 15H5C2.79 15 1 16.79 1 19V21"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21V19C22.99 17.13 21.63 15.56 19.78 15.13"/>
                        <path d="M16 3.13C17.87 3.55 19.25 5.13 19.25 7C19.25 8.87 17.87 10.45 16 10.87"/>
                    </svg>
                    <h4 class="empty-state-title">No vendors yet</h4>
                    <p class="empty-state-text">Add your first vendor to start monitoring their security risk.</p>
                    <button class="btn btn-primary" onclick="router.navigate('add-vendor')">
                        Add Vendor
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Vendor</th>
                            <th>Domain</th>
                            <th>Criticality</th>
                            <th>Risk Score</th>
                            <th>Status</th>
                            <th>Assessed</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vendors.map(v => `
                            <tr onclick="router.navigate('vendor-detail', '${v.vendorId}')" style="cursor: pointer;">
                                <td><strong>${v.name}</strong></td>
                                <td>${v.domain}</td>
                                <td><span class="risk-badge ${v.criticality.toLowerCase()}">${v.criticality}</span></td>
                                <td>${v.latestRisk ? v.latestRisk.riskScore : 'N/A'}</td>
                                <td>
                                    ${v.latestRisk ?
                `<span class="risk-badge ${ui.getRiskColor(v.latestRisk.riskLevel)}">${v.latestRisk.riskLevel}</span>` :
                '<span class="risk-badge">Pending</span>'}
                                </td>
                                <td>${v.latestRisk ? ui.formatRelativeTime(v.latestRisk.assessedAt) : 'Never'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Vendors List Page
    async vendors() {
        document.getElementById('page-title').textContent = 'Vendors';
        document.getElementById('page-subtitle').textContent = 'All monitored third-party vendors';

        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="flex items-center gap-4">
                        <input type="text" class="form-input" id="vendor-search" 
                               placeholder="Search vendors..." style="max-width: 300px;">
                    </div>
                    <button class="btn btn-primary" onclick="router.navigate('add-vendor')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
                        </svg>
                        Add Vendor
                    </button>
                </div>
                <div class="card-body" id="vendors-list">
                    <div class="skeleton" style="height: 200px;"></div>
                </div>
            </div>
        `;

        try {
            const vendors = await api.getVendors();
            state.vendors = vendors;
            this.renderVendorsList(vendors);

            // Setup search
            document.getElementById('vendor-search').addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = vendors.filter(v =>
                    v.name.toLowerCase().includes(query) ||
                    v.domain.toLowerCase().includes(query)
                );
                this.renderVendorsList(filtered);
            });
        } catch (error) {
            ui.showToast('Failed to load vendors', 'error');
            this.renderVendorsList([]);
        }
    },

    renderVendorsList(vendors) {
        const container = document.getElementById('vendors-list');

        if (vendors.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <h4 class="empty-state-title">No vendors found</h4>
                    <p class="empty-state-text">Try adjusting your search or add a new vendor.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Vendor</th>
                            <th>Domain</th>
                            <th>Environment</th>
                            <th>Criticality</th>
                            <th>Risk Score</th>
                            <th>Confidence</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vendors.map(v => `
                            <tr>
                                <td><strong>${v.name}</strong></td>
                                <td>${v.domain}</td>
                                <td>${v.environment}</td>
                                <td><span class="risk-badge ${v.criticality.toLowerCase()}">${v.criticality}</span></td>
                                <td>
                                    <div class="risk-score-display">
                                        <span style="font-weight: 600; color: var(--color-risk-${v.latestRisk ? ui.getRiskColor(v.latestRisk.riskLevel) : 'low'})">
                                            ${v.latestRisk ? v.latestRisk.riskScore : 'N/A'}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    ${v.latestRisk ? `
                                        <div class="confidence-meter">
                                            <div class="confidence-bar">
                                                <div class="confidence-fill" style="width: ${v.latestRisk.confidence * 100}%"></div>
                                            </div>
                                            <span class="confidence-value">${Math.round(v.latestRisk.confidence * 100)}%</span>
                                        </div>
                                    ` : 'N/A'}
                                </td>
                                <td>
                                    ${v.latestRisk ?
                `<span class="risk-badge ${ui.getRiskColor(v.latestRisk.riskLevel)}">${v.latestRisk.riskLevel}</span>` :
                '<span class="risk-badge">Pending</span>'}
                                </td>
                                <td>
                                    <div class="flex gap-4">
                                        <button class="btn btn-ghost" onclick="pages.viewVendorRisk('${v.vendorId}')" title="View Risk Details">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        </button>
                                        <button class="btn btn-ghost" onclick="pages.triggerAssessment('${v.vendorId}')" title="Trigger Assessment">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M1 4v6h6M23 20v-6h-6"/>
                                                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                                            </svg>
                                        </button>
                                        <button class="btn btn-ghost" onclick="pages.showDecisionModal('${v.vendorId}')" title="Log Decision">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M9 11l3 3L22 4"/>
                                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Add Vendor Page
    async ['add-vendor']() {
        document.getElementById('page-title').textContent = 'Add Vendor';
        document.getElementById('page-subtitle').textContent = 'Onboard a new third-party vendor for monitoring';

        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="card" style="max-width: 800px;">
                <div class="card-header">
                    <h3 class="card-title">Vendor Information</h3>
                </div>
                <div class="card-body">
                    <form id="add-vendor-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="vendor-name">Vendor Name *</label>
                                <input type="text" class="form-input" id="vendor-name" 
                                       placeholder="e.g., Acme Corp" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="vendor-domain">Domain *</label>
                                <input type="text" class="form-input" id="vendor-domain" 
                                       placeholder="e.g., acme.com" required>
                                <p class="form-hint">The primary domain of the vendor</p>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="vendor-criticality">Business Criticality *</label>
                                <select class="form-select" id="vendor-criticality" required>
                                    <option value="">Select criticality level</option>
                                    <option value="LOW">Low - Non-critical vendor</option>
                                    <option value="MEDIUM">Medium - Moderate business impact</option>
                                    <option value="HIGH">High - Critical to operations</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="vendor-environment">Environment *</label>
                                <select class="form-select" id="vendor-environment" required>
                                    <option value="">Select environment</option>
                                    <option value="PROD">Production</option>
                                    <option value="NON_PROD">Non-Production</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="vendor-description">Description</label>
                            <textarea class="form-textarea" id="vendor-description" 
                                      placeholder="Brief description of the vendor's services..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="vendor-contact">Contact Email</label>
                            <input type="email" class="form-input" id="vendor-contact" 
                                   placeholder="security@vendor.com">
                        </div>
                        
                        <div class="flex justify-between items-center mt-6">
                            <button type="button" class="btn btn-secondary" onclick="router.navigate('vendors')">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary" id="submit-vendor-btn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
                                </svg>
                                Add Vendor
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('add-vendor-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitVendor();
        });
    },

    async submitVendor() {
        const submitBtn = document.getElementById('submit-vendor-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Adding...</span>';

        try {
            const data = {
                name: document.getElementById('vendor-name').value,
                domain: document.getElementById('vendor-domain').value,
                criticality: document.getElementById('vendor-criticality').value,
                environment: document.getElementById('vendor-environment').value,
                description: document.getElementById('vendor-description').value,
                contactEmail: document.getElementById('vendor-contact').value
            };

            await api.createVendor(data);
            ui.showToast('Vendor added successfully! Initial risk assessment triggered.', 'success');
            router.navigate('vendors');
        } catch (error) {
            ui.showToast(error.message || 'Failed to add vendor', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg> Add Vendor';
        }
    },

    // Decisions Page
    async decisions() {
        document.getElementById('page-title').textContent = 'Decision Log';
        document.getElementById('page-subtitle').textContent = 'Audit trail of vendor risk decisions';

        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Recent Decisions</h3>
                    <div class="flex gap-4">
                        <select class="form-select" id="decision-filter" style="width: auto;">
                            <option value="">All Types</option>
                            <option value="ONBOARDING">Onboarding</option>
                            <option value="DEPLOYMENT">Deployment</option>
                        </select>
                    </div>
                </div>
                <div class="card-body" id="decisions-list">
                    <div class="skeleton" style="height: 200px;"></div>
                </div>
            </div>
        `;

        try {
            const decisions = await api.getDecisions();
            state.decisions = decisions;
            this.renderDecisionsList(decisions);

            document.getElementById('decision-filter').addEventListener('change', (e) => {
                const type = e.target.value;
                const filtered = type ? decisions.filter(d => d.decisionType === type) : decisions;
                this.renderDecisionsList(filtered);
            });
        } catch (error) {
            ui.showToast('Failed to load decisions', 'error');
            this.renderDecisionsList([]);
        }
    },

    renderDecisionsList(decisions) {
        const container = document.getElementById('decisions-list');

        if (decisions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M9 11l3 3L22 4"/>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    <h4 class="empty-state-title">No decisions logged</h4>
                    <p class="empty-state-text">Decision logs will appear here when you approve or flag vendors for review.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Vendor</th>
                            <th>Type</th>
                            <th>Decision</th>
                            <th>Risk at Decision</th>
                            <th>Decided By</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${decisions.map(d => `
                            <tr>
                                <td>${ui.formatDate(d.timestamp)}</td>
                                <td><strong>${d.vendorName || 'Unknown'}</strong></td>
                                <td><span class="risk-badge">${d.decisionType}</span></td>
                                <td>
                                    <span class="risk-badge ${d.decision === 'APPROVED' ? 'low' : 'medium'}">
                                        ${d.decision}
                                    </span>
                                </td>
                                <td>${d.riskScoreAtDecision || 'N/A'}</td>
                                <td>${d.decidedBy || 'System'}</td>
                                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                    ${d.reason}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // View Risk Details
    async viewVendorRisk(vendorId) {
        try {
            ui.setLoading(true);
            const [risk, history] = await Promise.all([
                api.getVendorRisk(vendorId),
                api.getRiskHistory(vendorId)
            ]);

            ui.showModal(`
                <div class="modal-header">
                    <h3 class="modal-title">${risk.vendorName} - Risk Details</h3>
                    <button class="modal-close" onclick="ui.hideModal()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="risk-score-circle ${ui.getRiskColor(risk.riskLevel)}" 
                             style="--score: ${risk.riskScore}">
                            ${risk.riskScore}
                        </div>
                        <div>
                            <div class="flex items-center gap-4">
                                <span class="risk-badge ${ui.getRiskColor(risk.riskLevel)}">${risk.riskLevel} RISK</span>
                            </div>
                            <div class="confidence-meter mt-4" style="width: 200px;">
                                <div class="confidence-bar">
                                    <div class="confidence-fill" style="width: ${risk.confidence * 100}%"></div>
                                </div>
                                <span class="confidence-value">${Math.round(risk.confidence * 100)}% confidence</span>
                            </div>
                        </div>
                    </div>
                    
                    <h4 style="margin-bottom: var(--space-3);">Evidence</h4>
                    <ul class="evidence-list">
                        ${risk.evidence.map(e => `
                            <li class="evidence-item">
                                <svg class="evidence-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                                <span>${e}</span>
                            </li>
                        `).join('')}
                    </ul>
                    
                    ${risk.advisory ? `
                        <div class="mt-6" style="padding: var(--space-4); background: var(--color-bg-tertiary); border-radius: var(--radius-lg);">
                            <h4 style="margin-bottom: var(--space-2);">Advisory</h4>
                            <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                                ${risk.advisory.recommendation}
                            </p>
                            ${risk.advisory.reviewRecommended ? `
                                <p style="color: var(--color-risk-medium); font-size: var(--font-size-sm); margin-top: var(--space-2);">
                                    ⚠️ Manual review is recommended before proceeding.
                                </p>
                            ` : ''}
                        </div>
                    ` : ''}
                    
                    ${history?.drift ? `
                        <div class="mt-6">
                            <h4 style="margin-bottom: var(--space-3);">Risk Trend</h4>
                            <div class="flex gap-4">
                                <div style="padding: var(--space-3); background: var(--color-bg-tertiary); border-radius: var(--radius-md); flex: 1;">
                                    <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Weekly Change</div>
                                    <div style="font-size: var(--font-size-lg); font-weight: 600; color: ${history.drift.weeklyChange > 0 ? 'var(--color-risk-high)' : history.drift.weeklyChange < 0 ? 'var(--color-risk-low)' : 'var(--color-text-secondary)'}">
                                        ${history.drift.weeklyChange > 0 ? '+' : ''}${history.drift.weeklyChange}
                                    </div>
                                </div>
                                <div style="padding: var(--space-3); background: var(--color-bg-tertiary); border-radius: var(--radius-md); flex: 1;">
                                    <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Trend</div>
                                    <div style="font-size: var(--font-size-lg); font-weight: 600;">
                                        ${history.drift.trend === 'IMPROVING' ? '📉 Improving' :
                        history.drift.trend === 'WORSENING' ? '📈 Worsening' : '➡️ Stable'}
                                    </div>
                                </div>
                                <div style="padding: var(--space-3); background: var(--color-bg-tertiary); border-radius: var(--radius-md); flex: 1;">
                                    <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Snapshots</div>
                                    <div style="font-size: var(--font-size-lg); font-weight: 600;">${history.drift.snapshotCount}</div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="ui.hideModal()">Close</button>
                    <button class="btn btn-primary" onclick="pages.showDecisionModal('${vendorId}'); ui.hideModal();">
                        Log Decision
                    </button>
                </div>
            `);
        } catch (error) {
            ui.showToast('Failed to load risk details', 'error');
        } finally {
            ui.setLoading(false);
        }
    },

    // Trigger Assessment
    async triggerAssessment(vendorId) {
        try {
            ui.showToast('Triggering risk assessment...', 'info');
            await api.triggerAssessment(vendorId);
            ui.showToast('Risk assessment completed!', 'success');

            // Refresh the current page
            if (state.currentPage === 'vendors') {
                this.vendors();
            } else if (state.currentPage === 'dashboard') {
                this.dashboard();
            }
        } catch (error) {
            ui.showToast('Failed to trigger assessment', 'error');
        }
    },

    // Decision Modal
    showDecisionModal(vendorId) {
        const vendor = state.vendors.find(v => v.vendorId === vendorId);

        ui.showModal(`
            <div class="modal-header">
                <h3 class="modal-title">Log Decision</h3>
                <button class="modal-close" onclick="ui.hideModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <form id="decision-form">
                    <input type="hidden" id="decision-vendor-id" value="${vendorId}">
                    
                    <div class="form-group">
                        <label class="form-label">Vendor</label>
                        <input type="text" class="form-input" value="${vendor?.name || 'Unknown'}" disabled>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="decision-type">Decision Type *</label>
                            <select class="form-select" id="decision-type" required>
                                <option value="">Select type</option>
                                <option value="ONBOARDING">Onboarding</option>
                                <option value="DEPLOYMENT">Deployment</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="decision-outcome">Decision *</label>
                            <select class="form-select" id="decision-outcome" required>
                                <option value="">Select decision</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REVIEW">Flagged for Review</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="decision-by">Decided By</label>
                        <input type="text" class="form-input" id="decision-by" 
                               placeholder="Your name or email">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="decision-reason">Reason *</label>
                        <textarea class="form-textarea" id="decision-reason" 
                                  placeholder="Provide justification for this decision..." required></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="ui.hideModal()">Cancel</button>
                <button class="btn btn-primary" onclick="pages.submitDecision()">
                    Log Decision
                </button>
            </div>
        `);
    },

    async submitDecision() {
        try {
            const data = {
                vendorId: document.getElementById('decision-vendor-id').value,
                decisionType: document.getElementById('decision-type').value,
                decision: document.getElementById('decision-outcome').value,
                decidedBy: document.getElementById('decision-by').value || 'Dashboard User',
                reason: document.getElementById('decision-reason').value
            };

            if (!data.decisionType || !data.decision || !data.reason) {
                ui.showToast('Please fill in all required fields', 'warning');
                return;
            }

            await api.logDecision(data);
            ui.hideModal();
            ui.showToast('Decision logged successfully!', 'success');
        } catch (error) {
            ui.showToast('Failed to log decision', 'error');
        }
    }
};

// ============================================
// Router
// ============================================
const router = {
    navigate(page, params = null) {
        state.currentPage = page;
        state.selectedVendor = params;

        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });

        // Render page
        if (pages[page]) {
            pages[page]();
        } else if (page === 'vendor-detail' && params) {
            pages.viewVendorRisk(params);
        }
    }
};

// ============================================
// Initialization
// ============================================
async function init() {
    // Setup navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            router.navigate(item.dataset.page);
        });
    });

    // Setup refresh button
    document.getElementById('refresh-btn').addEventListener('click', () => {
        router.navigate(state.currentPage);
        ui.showToast('Data refreshed', 'success');
    });

    // Check API health
    try {
        await api.checkHealth();
        state.apiConnected = true;
        document.querySelector('.status-dot').classList.remove('error');
        document.querySelector('.status-text').textContent = 'API Connected';
    } catch (error) {
        state.apiConnected = false;
        document.querySelector('.status-dot').classList.add('error');
        document.querySelector('.status-text').textContent = 'API Offline';
        ui.showToast('Backend API is not available. Some features may not work.', 'warning');
    }

    // Load initial page
    router.navigate('dashboard');
}

// Start application
document.addEventListener('DOMContentLoaded', init);
