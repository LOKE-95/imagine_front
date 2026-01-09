/**
 * SupplyLens - Vendor Risk Intelligence Platform
 * Main Application JavaScript
 */

// =====================================================
// UUID Generator
// =====================================================
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// =====================================================
// Local Storage Data Management
// =====================================================
const Storage = {
  get: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage get error:', e);
      return null;
    }
  },
  set: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage set error:', e);
    }
  }
};

// =====================================================
// Seed Data
// =====================================================
const SEED_VENDORS = [
  {
    vendorId: generateUUID(),
    name: 'Stripe',
    domain: 'stripe.com',
    criticality: 'HIGH',
    environment: 'PROD',
    description: 'Payment processing and financial infrastructure',
    contactEmail: 'security@stripe.com',
    createdAt: '2026-01-05T10:00:00Z',
    latestRisk: {
      riskScore: 28,
      riskLevel: 'LOW',
      confidence: 0.92,
      assessedAt: '2026-01-05T10:00:05Z',
      evidence: [
        'Azure OpenAI: Strong security posture with SOC2 Type II certification',
        'Content Safety: No harmful content detected (Score: 98)',
        'Language: Positive professional communication tone',
        'Document Intelligence: SOC2 Type II and PCI-DSS compliant',
        'Anomaly Detector: Stable risk trend, no anomalies',
        'AI Search: Similar to established fintech leaders',
        'Bing News: No security incidents, positive coverage'
      ],
      advisory: {
        recommendation: 'Excellent vendor with strong security. Annual review recommended.',
        reviewRecommended: false
      },
      aiServices: {
        openai: { score: 25, reasoning: 'Strong security infrastructure and compliance' },
        contentSafety: { score: 98, safe: true },
        language: { sentiment: 'positive', score: 0.91 },
        documentIntel: { compliant: true, certifications: ['SOC2', 'PCI-DSS'] },
        anomalyDetector: { hasAnomalies: false, trend: 'STABLE' },
        aiSearch: { similarVendors: ['PayPal', 'Square', 'Braintree'] },
        bingNews: { alertCount: 0, sentiment: 'positive' }
      }
    }
  },
  {
    vendorId: generateUUID(),
    name: 'Salesforce',
    domain: 'salesforce.com',
    criticality: 'MEDIUM',
    environment: 'PROD',
    description: 'Customer relationship management platform',
    contactEmail: 'security@salesforce.com',
    createdAt: '2026-01-04T14:30:00Z',
    latestRisk: {
      riskScore: 32,
      riskLevel: 'LOW',
      confidence: 0.88,
      assessedAt: '2026-01-04T14:30:10Z',
      evidence: [
        'Azure OpenAI: Solid enterprise security practices',
        'Content Safety: Clean content profile (Score: 95)',
        'Language: Professional communication patterns',
        'Document Intelligence: ISO 27001 and SOC2 certified',
        'Anomaly Detector: Consistent risk profile',
        'AI Search: Leading CRM with established trust',
        'Bing News: Regular security updates reported'
      ],
      advisory: {
        recommendation: 'Trusted enterprise vendor. Standard monitoring applies.',
        reviewRecommended: false
      },
      aiServices: {
        openai: { score: 30, reasoning: 'Enterprise-grade security with mature practices' },
        contentSafety: { score: 95, safe: true },
        language: { sentiment: 'positive', score: 0.85 },
        documentIntel: { compliant: true, certifications: ['ISO 27001', 'SOC2'] },
        anomalyDetector: { hasAnomalies: false, trend: 'STABLE' },
        aiSearch: { similarVendors: ['HubSpot', 'Microsoft Dynamics'] },
        bingNews: { alertCount: 0, sentiment: 'neutral' }
      }
    }
  },
  {
    vendorId: generateUUID(),
    name: 'Legacy ERP System',
    domain: 'legacyerp.internal',
    criticality: 'HIGH',
    environment: 'PROD',
    description: 'Legacy enterprise resource planning system',
    contactEmail: 'admin@legacyerp.internal',
    createdAt: '2026-01-03T09:00:00Z',
    latestRisk: {
      riskScore: 78,
      riskLevel: 'HIGH',
      confidence: 0.85,
      assessedAt: '2026-01-03T09:00:15Z',
      evidence: [
        'Azure OpenAI: Outdated security practices, legacy architecture concerns',
        'Content Safety: Some documentation gaps flagged (Score: 72)',
        'Language: Concerning patterns in security responses',
        'Document Intelligence: Expired certifications detected',
        'Anomaly Detector: Risk score trending upward',
        'AI Search: No similar modern alternatives found',
        'Bing News: No recent updates (concerning for security)'
      ],
      advisory: {
        recommendation: 'High risk vendor requiring immediate attention. Migration recommended.',
        reviewRecommended: true
      },
      aiServices: {
        openai: { score: 75, reasoning: 'Legacy system with outdated security controls' },
        contentSafety: { score: 72, safe: false },
        language: { sentiment: 'negative', score: 0.35 },
        documentIntel: { compliant: false, certifications: [] },
        anomalyDetector: { hasAnomalies: true, trend: 'WORSENING' },
        aiSearch: { similarVendors: [] },
        bingNews: { alertCount: 0, sentiment: 'neutral' }
      }
    }
  },
  {
    vendorId: generateUUID(),
    name: 'CloudWatch Analytics',
    domain: 'cloudwatch-analytics.io',
    criticality: 'MEDIUM',
    environment: 'PROD',
    description: 'Cloud monitoring and analytics service',
    contactEmail: 'support@cloudwatch-analytics.io',
    createdAt: '2026-01-02T11:15:00Z',
    latestRisk: {
      riskScore: 45,
      riskLevel: 'MEDIUM',
      confidence: 0.79,
      assessedAt: '2026-01-02T11:15:08Z',
      evidence: [
        'Azure OpenAI: Adequate security but gaps in documentation',
        'Content Safety: Minor concerns noted (Score: 82)',
        'Language: Neutral professional tone',
        'Document Intelligence: SOC2 in progress, not yet certified',
        'Anomaly Detector: Some variability in risk metrics',
        'AI Search: Similar to mid-tier cloud services',
        'Bing News: Limited coverage, no incidents'
      ],
      advisory: {
        recommendation: 'Medium risk vendor. Quarterly reviews recommended until SOC2 completion.',
        reviewRecommended: true
      },
      aiServices: {
        openai: { score: 45, reasoning: 'Growing company with improving security posture' },
        contentSafety: { score: 82, safe: true },
        language: { sentiment: 'neutral', score: 0.65 },
        documentIntel: { compliant: false, certifications: ['SOC2 In Progress'] },
        anomalyDetector: { hasAnomalies: false, trend: 'IMPROVING' },
        aiSearch: { similarVendors: ['Datadog', 'New Relic'] },
        bingNews: { alertCount: 0, sentiment: 'neutral' }
      }
    }
  },
  {
    vendorId: generateUUID(),
    name: 'DataSync Pro',
    domain: 'datasyncpro.com',
    criticality: 'LOW',
    environment: 'NON_PROD',
    description: 'Data synchronization utility for dev environments',
    contactEmail: 'info@datasyncpro.com',
    createdAt: '2026-01-01T16:45:00Z',
    latestRisk: {
      riskScore: 22,
      riskLevel: 'LOW',
      confidence: 0.91,
      assessedAt: '2026-01-01T16:45:12Z',
      evidence: [
        'Azure OpenAI: Low-risk utility with minimal data exposure',
        'Content Safety: Clean profile (Score: 96)',
        'Language: Professional support communications',
        'Document Intelligence: Basic security attestation provided',
        'Anomaly Detector: Stable, low-risk pattern',
        'AI Search: Standard dev tool category',
        'Bing News: No news coverage (expected for utility)'
      ],
      advisory: {
        recommendation: 'Low risk utility. Annual review sufficient.',
        reviewRecommended: false
      },
      aiServices: {
        openai: { score: 20, reasoning: 'Low-risk utility with limited scope' },
        contentSafety: { score: 96, safe: true },
        language: { sentiment: 'positive', score: 0.78 },
        documentIntel: { compliant: true, certifications: ['Security Attestation'] },
        anomalyDetector: { hasAnomalies: false, trend: 'STABLE' },
        aiSearch: { similarVendors: ['Sync.com', 'Resilio'] },
        bingNews: { alertCount: 0, sentiment: 'neutral' }
      }
    }
  },
  {
    vendorId: generateUUID(),
    name: 'Acme Payments',
    domain: 'acmepayments.net',
    criticality: 'HIGH',
    environment: 'PROD',
    description: 'Regional payment gateway service',
    contactEmail: 'security@acmepayments.net',
    createdAt: '2025-12-28T08:30:00Z',
    latestRisk: {
      riskScore: 52,
      riskLevel: 'MEDIUM',
      confidence: 0.76,
      assessedAt: '2025-12-28T08:30:20Z',
      evidence: [
        'Azure OpenAI: Moderate security posture, some improvements needed',
        'Content Safety: Acceptable content profile (Score: 85)',
        'Language: Professional but some delays in responses',
        'Document Intelligence: PCI-DSS compliant, SOC2 pending',
        'Anomaly Detector: Slight upward trend in risk',
        'AI Search: Similar to regional payment processors',
        'Bing News: Minor incident reported last year, resolved'
      ],
      advisory: {
        recommendation: 'Medium risk payment vendor. Enhanced monitoring recommended.',
        reviewRecommended: true
      },
      aiServices: {
        openai: { score: 50, reasoning: 'Adequate security with room for improvement' },
        contentSafety: { score: 85, safe: true },
        language: { sentiment: 'neutral', score: 0.62 },
        documentIntel: { compliant: true, certifications: ['PCI-DSS'] },
        anomalyDetector: { hasAnomalies: false, trend: 'STABLE' },
        aiSearch: { similarVendors: ['Authorize.net', 'Worldpay'] },
        bingNews: { alertCount: 1, sentiment: 'neutral' }
      }
    }
  }
];

const SEED_DECISIONS = [
  {
    decisionId: generateUUID(),
    vendorId: SEED_VENDORS[0].vendorId,
    vendorName: 'Stripe',
    decisionType: 'ONBOARDING',
    decision: 'APPROVED',
    reason: 'Meets all security requirements. Strong SOC2 and PCI-DSS compliance.',
    riskScoreAtDecision: 28,
    decidedBy: 'Security Team',
    timestamp: '2026-01-05T10:30:00Z'
  },
  {
    decisionId: generateUUID(),
    vendorId: SEED_VENDORS[2].vendorId,
    vendorName: 'Legacy ERP System',
    decisionType: 'EXCEPTION',
    decision: 'PENDING',
    reason: 'High risk but business critical. Migration plan required within 6 months.',
    riskScoreAtDecision: 78,
    decidedBy: 'CISO Office',
    timestamp: '2026-01-03T14:00:00Z'
  }
];

// Initialize data if not present
const initializeData = () => {
  if (!Storage.get('vendors')) {
    Storage.set('vendors', SEED_VENDORS);
  }
  if (!Storage.get('decisions')) {
    Storage.set('decisions', SEED_DECISIONS);
  }
};

// =====================================================
// Risk Score Calculation
// =====================================================
const calculateRiskScore = (vendor) => {
  let baseScore = Math.random() * 40 + 20;
  
  if (vendor.criticality === 'HIGH') baseScore += 15;
  else if (vendor.criticality === 'MEDIUM') baseScore += 8;
  
  if (vendor.environment === 'PROD') baseScore += 10;
  
  const variance = Math.random() * 20 - 10;
  return Math.min(100, Math.max(0, Math.round(baseScore + variance)));
};

const getRiskLevel = (score) => {
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
};

// =====================================================
// AI Services Simulation
// =====================================================
const AIServices = {
  simulateOpenAI: (vendor, baseScore) => {
    const reasoning = baseScore >= 70
      ? 'Multiple security concerns identified. Outdated practices and missing certifications.'
      : baseScore >= 40
      ? 'Adequate security posture with minor gaps in documentation or compliance.'
      : 'Strong security posture with valid certifications and no significant concerns.';
    return { score: baseScore, reasoning };
  },

  simulateContentSafety: (baseScore) => {
    const safetyScore = Math.max(60, 100 - baseScore + Math.random() * 10);
    return {
      score: Math.round(safetyScore),
      safe: safetyScore >= 75,
      flaggedCategories: safetyScore < 75 ? ['Documentation gaps'] : []
    };
  },

  simulateLanguage: (baseScore) => {
    const sentimentScore = Math.max(0.3, 1 - (baseScore / 100) + Math.random() * 0.2);
    const sentiment = sentimentScore > 0.7 ? 'positive' : sentimentScore > 0.4 ? 'neutral' : 'negative';
    return { sentiment, score: Math.round(sentimentScore * 100) / 100 };
  },

  simulateDocumentIntel: (vendor) => {
    const compliant = vendor.criticality !== 'HIGH' || Math.random() > 0.3;
    const certs = compliant 
      ? ['SOC2 Type II', 'ISO 27001'].filter(() => Math.random() > 0.3)
      : [];
    return {
      compliant,
      certifications: certs,
      auditPeriod: '2025-2026',
      auditor: 'Deloitte'
    };
  },

  simulateAnomalyDetector: (baseScore) => {
    const hasAnomalies = baseScore >= 70 && Math.random() > 0.5;
    const trend = baseScore >= 60 ? 'WORSENING' : baseScore >= 40 ? 'STABLE' : 'IMPROVING';
    return { hasAnomalies, trend };
  },

  simulateAISearch: (vendor) => {
    const vendorCategories = {
      'payment': ['PayPal', 'Square', 'Braintree'],
      'crm': ['HubSpot', 'Microsoft Dynamics', 'Zoho'],
      'analytics': ['Datadog', 'New Relic', 'Splunk'],
      'default': ['Similar Vendor A', 'Similar Vendor B']
    };
    const desc = vendor.description?.toLowerCase() || '';
    if (desc.includes('payment')) return { similarVendors: vendorCategories.payment };
    if (desc.includes('crm') || desc.includes('customer')) return { similarVendors: vendorCategories.crm };
    if (desc.includes('analytics') || desc.includes('monitor')) return { similarVendors: vendorCategories.analytics };
    return { similarVendors: vendorCategories.default };
  },

  simulateBingNews: (baseScore) => {
    const alertCount = baseScore >= 70 ? Math.floor(Math.random() * 3) : 0;
    const sentiment = alertCount > 0 ? 'negative' : baseScore < 40 ? 'positive' : 'neutral';
    return { alertCount, sentiment };
  },

  generateEvidence: (services, riskLevel) => {
    const evidence = [];
    const openaiStatus = services.openai.score < 40 ? 'Strong' : services.openai.score < 70 ? 'Adequate' : 'Concerning';
    evidence.push(`Azure OpenAI: ${openaiStatus} security posture - ${services.openai.reasoning}`);
    
    const safetyStatus = services.contentSafety.safe ? 'No harmful content' : 'Content review recommended';
    evidence.push(`Content Safety: ${safetyStatus} (Score: ${services.contentSafety.score})`);
    
    evidence.push(`Language: ${services.language.sentiment.charAt(0).toUpperCase() + services.language.sentiment.slice(1)} sentiment in communications`);
    
    if (services.documentIntel.compliant) {
      evidence.push(`Document Intelligence: ${services.documentIntel.certifications.join(', ') || 'Basic compliance'} certified`);
    } else {
      evidence.push('Document Intelligence: Missing or expired certifications');
    }
    
    evidence.push(`Anomaly Detector: ${services.anomalyDetector.hasAnomalies ? 'Anomalies detected' : 'No unusual patterns'}, trend ${services.anomalyDetector.trend}`);
    
    if (services.aiSearch.similarVendors.length > 0) {
      evidence.push(`AI Search: Similar to ${services.aiSearch.similarVendors.slice(0, 2).join(', ')}`);
    }
    
    if (services.bingNews.alertCount > 0) {
      evidence.push(`Bing News: ${services.bingNews.alertCount} security alert(s) reported`);
    } else {
      evidence.push('Bing News: No security incidents reported');
    }
    
    return evidence;
  }
};

// =====================================================
// Full Assessment Flow
// =====================================================
const runAssessment = async (vendor) => {
  const modal = document.getElementById('assessment-modal');
  const statusEl = document.getElementById('assessment-status');
  const progressEl = document.getElementById('assessment-progress');
  
  modal.classList.add('active');
  progressEl.innerHTML = '';
  
  const steps = [
    { name: 'Azure OpenAI (GPT-4)', icon: '🧠', delay: 400 },
    { name: 'Content Safety', icon: '🛡️', delay: 350 },
    { name: 'Language Analysis', icon: '💬', delay: 300 },
    { name: 'Document Intelligence', icon: '📄', delay: 400 },
    { name: 'Anomaly Detector', icon: '📈', delay: 350 },
    { name: 'AI Search (RAG)', icon: '🔎', delay: 300 },
    { name: 'Bing News Search', icon: '📰', delay: 350 }
  ];
  
  for (const step of steps) {
    statusEl.textContent = `Analyzing with ${step.name}...`;
    await new Promise(r => setTimeout(r, step.delay));
    progressEl.innerHTML += `
      <div class="evidence-item">
        <div class="evidence-icon success">${step.icon}</div>
        <div class="evidence-content">
          <div class="evidence-title">${step.name}</div>
          <div class="evidence-description">Analysis complete</div>
        </div>
      </div>
    `;
  }
  
  statusEl.textContent = 'Calculating weighted risk score...';
  await new Promise(r => setTimeout(r, 500));
  
  // Generate assessment
  const riskScore = calculateRiskScore(vendor);
  const riskLevel = getRiskLevel(riskScore);
  
  const aiServices = {
    openai: AIServices.simulateOpenAI(vendor, riskScore),
    contentSafety: AIServices.simulateContentSafety(riskScore),
    language: AIServices.simulateLanguage(riskScore),
    documentIntel: AIServices.simulateDocumentIntel(vendor),
    anomalyDetector: AIServices.simulateAnomalyDetector(riskScore),
    aiSearch: AIServices.simulateAISearch(vendor),
    bingNews: AIServices.simulateBingNews(riskScore)
  };
  
  const evidence = AIServices.generateEvidence(aiServices, riskLevel);
  const confidence = 0.7 + Math.random() * 0.25;
  
  const assessment = {
    riskScore,
    riskLevel,
    confidence: Math.round(confidence * 100) / 100,
    assessedAt: new Date().toISOString(),
    evidence,
    advisory: {
      recommendation: riskLevel === 'HIGH' 
        ? 'High risk vendor. Immediate review and remediation plan required.'
        : riskLevel === 'MEDIUM'
        ? 'Medium risk vendor. Enhanced monitoring and quarterly reviews recommended.'
        : 'Low risk vendor. Standard annual review cycle applies.',
      reviewRecommended: riskLevel !== 'LOW'
    },
    aiServices
  };
  
  // Update vendor
  const vendors = Storage.get('vendors') || [];
  const idx = vendors.findIndex(v => v.vendorId === vendor.vendorId);
  if (idx !== -1) {
    vendors[idx].latestRisk = assessment;
    Storage.set('vendors', vendors);
  }
  
  modal.classList.remove('active');
  showToast('success', 'Assessment Complete', `Risk score: ${riskScore} (${riskLevel})`);
  
  refreshCurrentPage();
  return assessment;
};

// =====================================================
// Navigation
// =====================================================
let currentPage = 'dashboard';

const navigateTo = (page) => {
  currentPage = page;
  
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  
  // Update page sections
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.toggle('active', section.id === `page-${page}`);
  });
  
  refreshCurrentPage();
};

const refreshCurrentPage = () => {
  switch (currentPage) {
    case 'dashboard': renderDashboard(); break;
    case 'vendors': renderVendors(); break;
    case 'decisions': renderDecisions(); break;
  }
};

// Navigation click handlers
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => navigateTo(item.dataset.page));
});

// =====================================================
// Dashboard Rendering
// =====================================================
let riskChart = null;
let criticalityChart = null;

const renderDashboard = () => {
  const vendors = Storage.get('vendors') || [];
  
  // Stats
  const stats = {
    total: vendors.length,
    high: vendors.filter(v => v.latestRisk?.riskLevel === 'HIGH').length,
    medium: vendors.filter(v => v.latestRisk?.riskLevel === 'MEDIUM').length,
    low: vendors.filter(v => v.latestRisk?.riskLevel === 'LOW').length
  };
  
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-high').textContent = stats.high;
  document.getElementById('stat-medium').textContent = stats.medium;
  document.getElementById('stat-low').textContent = stats.low;
  
  // Charts
  renderRiskChart(stats);
  renderCriticalityChart(vendors);
  
  // Recent vendors table
  const recentVendors = [...vendors]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  
  const tbody = document.getElementById('recent-vendors-table');
  tbody.innerHTML = recentVendors.map(v => `
    <tr>
      <td><strong>${v.name}</strong></td>
      <td>${v.domain}</td>
      <td><span class="badge ${v.criticality.toLowerCase()}">${v.criticality}</span></td>
      <td>${v.latestRisk ? `<span class="risk-pill ${v.latestRisk.riskLevel.toLowerCase()}">${v.latestRisk.riskScore}</span>` : '—'}</td>
      <td>${v.latestRisk ? '<span style="color: var(--success)">✓ Assessed</span>' : '<span style="color: var(--text-muted)">Pending</span>'}</td>
      <td>${formatDate(v.createdAt)}</td>
    </tr>
  `).join('');
};

const renderRiskChart = (stats) => {
  const ctx = document.getElementById('riskDistributionChart');
  if (!ctx) return;
  
  if (riskChart) riskChart.destroy();
  
  riskChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['High Risk', 'Medium Risk', 'Low Risk'],
      datasets: [{
        data: [stats.high, stats.medium, stats.low],
        backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#a0a0b0', padding: 20, font: { family: 'Inter' } }
        }
      }
    }
  });
};

const renderCriticalityChart = (vendors) => {
  const ctx = document.getElementById('criticalityChart');
  if (!ctx) return;
  
  if (criticalityChart) criticalityChart.destroy();
  
  const critStats = {
    high: vendors.filter(v => v.criticality === 'HIGH').length,
    medium: vendors.filter(v => v.criticality === 'MEDIUM').length,
    low: vendors.filter(v => v.criticality === 'LOW').length
  };
  
  criticalityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['High', 'Medium', 'Low'],
      datasets: [{
        label: 'Vendors',
        data: [critStats.high, critStats.medium, critStats.low],
        backgroundColor: ['rgba(99, 102, 241, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(168, 85, 247, 0.8)'],
        borderRadius: 8,
        barThickness: 40
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1, color: '#6b6b7b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        x: { ticks: { color: '#a0a0b0' }, grid: { display: false } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
};

// =====================================================
// Vendors Page
// =====================================================
let vendorSearchTimeout = null;

const renderVendors = () => {
  const vendors = Storage.get('vendors') || [];
  const searchTerm = document.getElementById('vendor-search')?.value.toLowerCase() || '';
  const critFilter = document.getElementById('filter-criticality')?.value || '';
  const riskFilter = document.getElementById('filter-risk')?.value || '';
  
  let filtered = vendors.filter(v => {
    if (searchTerm && !v.name.toLowerCase().includes(searchTerm) && !v.domain.toLowerCase().includes(searchTerm)) return false;
    if (critFilter && v.criticality !== critFilter) return false;
    if (riskFilter && v.latestRisk?.riskLevel !== riskFilter) return false;
    return true;
  });
  
  const tbody = document.getElementById('vendors-table');
  const emptyState = document.getElementById('vendors-empty');
  
  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    tbody.innerHTML = filtered.map(v => `
      <tr>
        <td><strong>${v.name}</strong><br><span class="text-muted text-sm">${v.description?.substring(0, 40) || ''}...</span></td>
        <td>${v.domain}</td>
        <td><span class="badge ${v.criticality.toLowerCase()}">${v.criticality}</span></td>
        <td>${v.latestRisk ? `<span class="risk-pill ${v.latestRisk.riskLevel.toLowerCase()}">${v.latestRisk.riskScore}</span>` : '—'}</td>
        <td>${v.latestRisk ? `${Math.round(v.latestRisk.confidence * 100)}%` : '—'}</td>
        <td>${v.latestRisk ? '<span style="color: var(--success)">✓ Assessed</span>' : '<span style="color: var(--warning)">⏳ Pending</span>'}</td>
        <td class="actions-cell">
          <button class="btn btn-ghost btn-sm" onclick="viewRiskDetails('${v.vendorId}')" title="View Risk">👁</button>
          <button class="btn btn-ghost btn-sm" onclick="triggerAssessment('${v.vendorId}')" title="Assess">🔄</button>
          <button class="btn btn-ghost btn-sm" onclick="openDecisionModal('${v.vendorId}')" title="Log Decision">📋</button>
        </td>
      </tr>
    `).join('');
  }
};

// Search debounce
document.getElementById('vendor-search')?.addEventListener('input', () => {
  clearTimeout(vendorSearchTimeout);
  vendorSearchTimeout = setTimeout(renderVendors, 300);
});

document.getElementById('filter-criticality')?.addEventListener('change', renderVendors);
document.getElementById('filter-risk')?.addEventListener('change', renderVendors);

// =====================================================
// Add Vendor Form
// =====================================================
document.getElementById('add-vendor-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const vendor = {
    vendorId: generateUUID(),
    name: formData.get('name'),
    domain: formData.get('domain'),
    criticality: formData.get('criticality'),
    environment: formData.get('environment'),
    description: formData.get('description'),
    contactEmail: formData.get('contactEmail'),
    createdAt: new Date().toISOString(),
    latestRisk: null
  };
  
  const vendors = Storage.get('vendors') || [];
  vendors.push(vendor);
  Storage.set('vendors', vendors);
  
  e.target.reset();
  showToast('success', 'Vendor Added', `${vendor.name} has been registered`);
  
  // Trigger assessment
  await runAssessment(vendor);
  navigateTo('vendors');
});

// =====================================================
// Decisions Page
// =====================================================
const renderDecisions = () => {
  const decisions = Storage.get('decisions') || [];
  const typeFilter = document.getElementById('filter-decision-type')?.value || '';
  const decisionFilter = document.getElementById('filter-decision')?.value || '';
  
  let filtered = decisions.filter(d => {
    if (typeFilter && d.decisionType !== typeFilter) return false;
    if (decisionFilter && d.decision !== decisionFilter) return false;
    return true;
  });
  
  filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  const tbody = document.getElementById('decisions-table');
  const emptyState = document.getElementById('decisions-empty');
  
  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    tbody.innerHTML = filtered.map(d => `
      <tr>
        <td>${formatDateTime(d.timestamp)}</td>
        <td><strong>${d.vendorName}</strong></td>
        <td><span class="badge">${d.decisionType}</span></td>
        <td><span class="badge ${d.decision === 'APPROVED' ? 'low' : d.decision === 'REJECTED' ? 'high' : 'medium'}">${d.decision}</span></td>
        <td>${d.riskScoreAtDecision}</td>
        <td>${d.decidedBy}</td>
        <td class="text-muted">${d.reason.substring(0, 50)}...</td>
      </tr>
    `).join('');
  }
};

document.getElementById('filter-decision-type')?.addEventListener('change', renderDecisions);
document.getElementById('filter-decision')?.addEventListener('change', renderDecisions);

// =====================================================
// Risk Details Modal
// =====================================================
const viewRiskDetails = (vendorId) => {
  const vendors = Storage.get('vendors') || [];
  const vendor = vendors.find(v => v.vendorId === vendorId);
  if (!vendor) return;
  
  const risk = vendor.latestRisk;
  const content = document.getElementById('risk-modal-content');
  
  if (!risk) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <h3 class="empty-state-title">No Assessment Available</h3>
        <p class="empty-state-description">Run an AI assessment to view risk details</p>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div class="risk-detail-header">
        <div class="risk-detail-score">
          <div class="risk-score-circle">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle class="bg-circle" cx="40" cy="40" r="35"/>
              <circle class="progress-circle ${risk.riskLevel.toLowerCase()}" cx="40" cy="40" r="35"
                stroke-dasharray="${2 * Math.PI * 35}"
                stroke-dashoffset="${2 * Math.PI * 35 * (1 - risk.riskScore / 100)}"/>
            </svg>
            <div class="risk-score-value" style="color: var(--risk-${risk.riskLevel.toLowerCase()})">${risk.riskScore}</div>
          </div>
          <span class="badge ${risk.riskLevel.toLowerCase()}" style="margin-top: 8px">${risk.riskLevel} RISK</span>
        </div>
        <div class="risk-detail-info">
          <h3>${vendor.name}</h3>
          <div class="risk-detail-meta">
            <span>🌐 ${vendor.domain}</span>
            <span>📅 ${formatDateTime(risk.assessedAt)}</span>
          </div>
          <div class="confidence-meter" style="margin-top: 12px">
            <span class="text-sm">Confidence:</span>
            <div class="confidence-bar">
              <div class="confidence-fill" style="width: ${risk.confidence * 100}%"></div>
            </div>
            <span class="confidence-value">${Math.round(risk.confidence * 100)}%</span>
          </div>
        </div>
      </div>
      
      <h4 style="margin: 20px 0 12px; font-size: 14px; color: var(--text-secondary)">AI ANALYSIS EVIDENCE</h4>
      <ul class="evidence-list">
        ${risk.evidence.map((e, i) => {
          const icons = ['🧠', '🛡️', '💬', '📄', '📈', '🔎', '📰'];
          const isPositive = e.toLowerCase().includes('strong') || e.toLowerCase().includes('no ') || e.toLowerCase().includes('positive') || e.toLowerCase().includes('compliant');
          return `
            <li class="evidence-item">
              <div class="evidence-icon ${isPositive ? 'success' : 'warning'}">${icons[i] || '✓'}</div>
              <div class="evidence-content">
                <div class="evidence-title">${e.split(':')[0]}</div>
                <div class="evidence-description">${e.split(':').slice(1).join(':')}</div>
              </div>
            </li>
          `;
        }).join('')}
      </ul>
      
      <div class="card" style="margin-top: 20px; background: var(--bg-tertiary)">
        <div class="card-content">
          <h4 style="margin-bottom: 8px">📋 Advisory</h4>
          <p style="color: var(--text-secondary)">${risk.advisory.recommendation}</p>
        </div>
      </div>
    `;
  }
  
  document.getElementById('risk-modal-decision-btn').onclick = () => {
    closeModal('risk-modal');
    openDecisionModal(vendorId);
  };
  
  openModal('risk-modal');
};

// =====================================================
// Decision Modal
// =====================================================
const openDecisionModal = (vendorId) => {
  const vendors = Storage.get('vendors') || [];
  const vendor = vendors.find(v => v.vendorId === vendorId);
  if (!vendor) return;
  
  document.getElementById('decision-vendor-id').value = vendorId;
  document.getElementById('decision-vendor-name').value = vendor.name;
  document.getElementById('decision-risk-score').value = vendor.latestRisk?.riskScore || 0;
  document.getElementById('decision-form').reset();
  
  openModal('decision-modal');
};

const submitDecision = () => {
  const form = document.getElementById('decision-form');
  const formData = new FormData(form);
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  const decision = {
    decisionId: generateUUID(),
    vendorId: formData.get('vendorId'),
    vendorName: formData.get('vendorName'),
    decisionType: formData.get('decisionType'),
    decision: formData.get('decision'),
    reason: formData.get('reason'),
    riskScoreAtDecision: parseInt(formData.get('riskScore')) || 0,
    decidedBy: formData.get('decidedBy'),
    timestamp: new Date().toISOString()
  };
  
  const decisions = Storage.get('decisions') || [];
  decisions.push(decision);
  Storage.set('decisions', decisions);
  
  closeModal('decision-modal');
  showToast('success', 'Decision Logged', `${decision.decision} - ${decision.vendorName}`);
  renderDecisions();
};

// Trigger assessment action
const triggerAssessment = (vendorId) => {
  const vendors = Storage.get('vendors') || [];
  const vendor = vendors.find(v => v.vendorId === vendorId);
  if (vendor) runAssessment(vendor);
};

// =====================================================
// Modal Helpers
// =====================================================
const openModal = (id) => document.getElementById(id)?.classList.add('active');
const closeModal = (id) => document.getElementById(id)?.classList.remove('active');

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
});

// =====================================================
// Toast Notifications
// =====================================================
const showToast = (type, title, message) => {
  const container = document.getElementById('toast-container');
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;
  
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
};

// =====================================================
// AI Copilot Chat
// =====================================================
const copilotBtn = document.getElementById('copilot-btn');
const copilotPanel = document.getElementById('copilot-panel');

copilotBtn?.addEventListener('click', () => {
  copilotBtn.classList.toggle('active');
  copilotPanel.classList.toggle('active');
});

const handleCopilotKeypress = (e) => {
  if (e.key === 'Enter') sendCopilotMessage();
};

const sendCopilotMessage = () => {
  const input = document.getElementById('copilot-input');
  const message = input.value.trim();
  if (!message) return;
  
  addChatMessage('user', message);
  input.value = '';
  
  // Show typing
  const messagesEl = document.getElementById('copilot-messages');
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  messagesEl.appendChild(typing);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  
  setTimeout(() => {
    typing.remove();
    const response = getCopilotResponse(message);
    addChatMessage('bot', response);
  }, 1000 + Math.random() * 500);
};

const askCopilot = (question) => {
  copilotBtn.classList.add('active');
  copilotPanel.classList.add('active');
  document.getElementById('copilot-input').value = question;
  sendCopilotMessage();
};

const addChatMessage = (type, content) => {
  const messagesEl = document.getElementById('copilot-messages');
  const avatar = type === 'bot' ? '🤖' : '👤';
  
  const msg = document.createElement('div');
  msg.className = `chat-message ${type}`;
  msg.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-bubble">${content}</div>
  `;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
};

const getCopilotResponse = (query) => {
  const q = query.toLowerCase();
  const vendors = Storage.get('vendors') || [];
  
  if (q.includes('high risk') || q.includes('high-risk')) {
    const highRisk = vendors.filter(v => v.latestRisk?.riskLevel === 'HIGH');
    if (highRisk.length === 0) return "Great news! 🎉 You currently have no high-risk vendors. All vendors are within acceptable risk thresholds.";
    return `⚠️ <strong>High Risk Vendors (${highRisk.length}):</strong><br><br>` + 
      highRisk.map(v => `• <strong>${v.name}</strong> (Score: ${v.latestRisk.riskScore})`).join('<br>') +
      `<br><br>I recommend reviewing these vendors immediately and considering remediation plans.`;
  }
  
  if (q.includes('compliance') || q.includes('soc2') || q.includes('certified')) {
    const compliant = vendors.filter(v => v.latestRisk?.aiServices?.documentIntel?.compliant);
    return `📋 <strong>Compliance Overview:</strong><br><br>` +
      `• ${compliant.length} of ${vendors.length} vendors are compliant<br>` +
      `• Common certifications: SOC2, ISO 27001, PCI-DSS<br><br>` +
      `Run document intelligence scans for detailed compliance reports.`;
  }
  
  if (q.includes('alert') || q.includes('breach') || q.includes('incident')) {
    const withAlerts = vendors.filter(v => v.latestRisk?.aiServices?.bingNews?.alertCount > 0);
    if (withAlerts.length === 0) return "🛡️ Good news! No security alerts or breaches detected in our monitoring of your vendor ecosystem.";
    return `🚨 <strong>Security Alerts:</strong><br><br>` +
      withAlerts.map(v => `• <strong>${v.name}</strong>: ${v.latestRisk.aiServices.bingNews.alertCount} alert(s)`).join('<br>') +
      `<br><br>Click on these vendors for detailed news analysis.`;
  }
  
  if (q.includes('trend') || q.includes('chart') || q.includes('overview')) {
    const high = vendors.filter(v => v.latestRisk?.riskLevel === 'HIGH').length;
    const medium = vendors.filter(v => v.latestRisk?.riskLevel === 'MEDIUM').length;
    const low = vendors.filter(v => v.latestRisk?.riskLevel === 'LOW').length;
    return `📊 <strong>Risk Distribution:</strong><br><br>` +
      `🔴 High Risk: ${high} vendors<br>` +
      `🟠 Medium Risk: ${medium} vendors<br>` +
      `🟢 Low Risk: ${low} vendors<br><br>` +
      `View the Dashboard for interactive charts.`;
  }
  
  if (q.includes('how') && q.includes('work')) {
    return `🤖 I'm powered by <strong>7 Azure AI services</strong>:<br><br>` +
      `• <strong>Azure OpenAI (GPT-4)</strong>: Risk reasoning (70% weight)<br>` +
      `• <strong>Content Safety</strong>: Harmful content detection (15%)<br>` +
      `• <strong>Language AI</strong>: Sentiment analysis (15%)<br>` +
      `• <strong>Document Intelligence</strong>: Compliance extraction<br>` +
      `• <strong>Anomaly Detector</strong>: Pattern analysis<br>` +
      `• <strong>AI Search</strong>: Similar vendor matching<br>` +
      `• <strong>Bing News</strong>: Security monitoring`;
  }
  
  if (q.includes('ssl') || q.includes('certificate')) {
    return `🔒 All monitored vendors have valid SSL certificates. Our Document Intelligence service automatically extracts and validates security certifications during assessment.`;
  }
  
  return `I can help you with:<br><br>` +
    `• "Which vendors have high risk?"<br>` +
    `• "Show me compliance status"<br>` +
    `• "Any security alerts?"<br>` +
    `• "Show risk trend overview"<br>` +
    `• "How does the AI work?"<br><br>` +
    `Ask me anything about your vendor risk landscape!`;
};

// =====================================================
// Utility Functions
// =====================================================
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  });
};

// =====================================================
// Initialize Application
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  initializeData();
  renderDashboard();
});
