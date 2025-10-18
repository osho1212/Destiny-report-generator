# 📚 Documentation Index

Welcome to the Destiny Report Generator documentation!

## Quick Links

### Getting Started
- [🚀 Quick Start Guide](QUICK_START.md) - Get up and running in minutes
- [📋 Project Structure](PROJECT_STRUCTURE.md) - Understand the codebase organization
- [🚀 Deployment Guide](DEPLOYMENT.md) - Deploy to production

### Main Documentation
- [📖 Main README](../README.md) - Project overview and features

---

## Documentation Structure

```
docs/
├── INDEX.md              # This file - documentation hub
├── QUICK_START.md        # Installation and setup guide
├── PROJECT_STRUCTURE.md  # Codebase organization
└── DEPLOYMENT.md         # Production deployment guide
```

---

## Key Features Documentation

### Form Management
The application uses React Hook Form for efficient form handling. Key form sections:
- Client Information
- Vastu Analysis (with house maps)
- Astrology (planets, houses, dashas, aspects)

### PDF Generation
PDF reports are generated using ReportLab in Python:
- Custom layouts with orange section borders
- Kundli PDF integration (pages 1, 3, 4)
- House map image embedding
- Bullet point formatting

### Mobile Responsiveness
Fully responsive design with:
- Mobile-optimized layouts
- Touch-friendly buttons (44px minimum)
- Adaptive typography
- Full-screen modals on small devices

---

## API Documentation

### Endpoints

#### Health Check
```http
GET /api/health
```
Returns server status.

#### Generate Report
```http
POST /api/generate-report
Content-Type: application/json

{
  "reportType": "pdf",
  "formData": { ... }
}
```
Generates and downloads PDF report.

#### Extract PDF Data
```http
POST /api/extract-pdf-data
Content-Type: application/json

{
  "pdfData": "base64_encoded_pdf"
}
```
Extracts text from uploaded Kundli PDF.

#### Convert PDF to Image
```http
POST /api/convert-pdf-to-image
Content-Type: application/json

{
  "pdfData": "base64_encoded_pdf"
}
```
Converts PDF to image format.

---

## Development Guidelines

### Code Style
- **Frontend**: React functional components with hooks
- **Backend**: PEP 8 Python style guide
- **CSS**: BEM-like naming conventions

### Component Structure
```javascript
// React components follow this pattern:
function ComponentName() {
  // State hooks
  // Effect hooks
  // Helper functions
  // Event handlers
  // Render
}
```

### API Service Layer
All backend calls go through `frontend/src/services/apiService.js` for centralized API management.

---

## Troubleshooting Resources

Common issues and solutions:
- [Port Conflicts](QUICK_START.md#port-already-in-use)
- [Virtual Environment Issues](QUICK_START.md#virtual-environment-not-activating)
- [Module Not Found](QUICK_START.md#module-not-found-errors)
- [Mobile Access](QUICK_START.md#cannot-access-on-mobile)

---

## Contributing

To contribute to the documentation:
1. Fork the repository
2. Create a feature branch
3. Update relevant documentation
4. Submit a pull request

---

## Support

For help:
- Check the documentation above
- Review [Main README](../README.md)
- Open an issue on GitHub

---

Last updated: 2025-10-18
