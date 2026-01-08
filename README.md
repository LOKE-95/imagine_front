# SupplyLens Dashboard

A responsive web dashboard for the SupplyLens vendor risk intelligence platform.

## Features

- 📊 Real-time vendor risk overview
- 📈 Risk history and trend visualization
- 🔍 Vendor search and filtering
- 📝 Decision logging interface
- 🔄 Manual assessment triggers

## Quick Start

```bash
# Using Python
python -m http.server 5500

# Using Node.js
npx serve -l 5500

# Using PHP
php -S localhost:5500
```

Open http://localhost:5500 in your browser.

## Configuration

Edit the `CONFIG` object in `app.js`:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:8080/api',  // Backend URL
    REFRESH_INTERVAL: 30000,                      // Auto-refresh (ms)
    TOAST_DURATION: 4000                          // Toast display (ms)
};
```

## Pages

- **Dashboard** - Overview with risk statistics
- **Vendors** - List of all monitored vendors with risk scores
- **Add Vendor** - Form to onboard new vendors
- **Decisions** - Audit log of all decisions

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
