# 📊 Destiny Report Generator

> A powerful full-stack application for generating custom astrology and vastu reports with PDF export functionality.

[![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776ab?logo=python)](https://python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

- 📝 **Comprehensive Form** - Dynamic form with sections for client info, vastu analysis, and astrology
- 🎨 **Live Preview** - Real-time preview before generating reports
- 📄 **PDF Export** - Professional PDF reports with Kundli integration
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 📱 **Mobile Responsive** - Fully optimized for mobile devices
- 🖼️ **Image Upload** - Support for house maps and Kundli PDFs
- ⚡ **Fast Generation** - Efficient report processing
- 🎯 **Custom Aspects** - Configurable aspects on houses and planets

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- Python 3.8+
- pip

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Destiny\ Report\ Generator
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

3. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install
npm start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Mobile Access: http://192.168.31.121:3000 (your local network IP)

---

## 📁 Project Structure

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed structure.

```
destiny-report-generator/
├── 📁 api/                  # Vercel serverless handlers
├── 📁 backend/              # Python Flask backend
│   ├── utils/               # Report generation logic
│   └── app.py               # Main Flask app
├── 📁 frontend/             # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   └── services/        # API layer
│   └── public/
├── 📁 docs/                 # Documentation
└── 📄 vercel.json           # Deployment config
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **PDF.js** - PDF processing
- **Custom CSS** - Responsive styling

### Backend
- **Python 3.8+** - Core language
- **Flask** - Web framework
- **ReportLab** - PDF generation
- **PyPDF2** - PDF manipulation
- **Pillow** - Image processing
- **python-docx** - Word document generation

---

## 📖 Documentation

- [📋 Project Structure](docs/PROJECT_STRUCTURE.md)
- [🚀 Deployment Guide](docs/DEPLOYMENT.md)

---

## 🌐 Deployment

### Ready to Deploy?

Your project is configured for **separate deployment**:

**Frontend → Vercel** (Global CDN, Free)
**Backend → Railway** (Free tier with $5/month credit)

### Quick Deploy Guide:

1. **Check readiness:**
   ```bash
   ./deploy-check.sh
   ```

2. **Follow the complete guide:**
   - [📘 Complete Deployment Guide](docs/DEPLOYMENT_COMPLETE.md) - Step-by-step instructions
   - [📋 Deployment Summary](DEPLOYMENT_SUMMARY.md) - Quick overview

### What You'll Get:
- ✅ Globally accessible URL (not just local WiFi!)
- ✅ Mobile-friendly from anywhere
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push
- ✅ **100% Free hosting!**

**Deployment time:** ~35 minutes
**Result:** `https://your-app.vercel.app` 🎉

---

## 🎯 Usage

1. **Fill the Form**
   - Enter client information
   - Upload Kundli PDF and house maps
   - Configure vastu analysis
   - Set astrology details (planets, houses, dashas)

2. **Configure Aspects**
   - Add aspects on houses
   - Add aspects on planets
   - Set removal and placement directions

3. **Preview**
   - Click "Preview & Generate Report"
   - Review all information

4. **Export**
   - Click "Export Report"
   - PDF will be downloaded automatically

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/generate-report` | Generate PDF report |
| POST | `/api/extract-pdf-data` | Extract Kundli text |
| POST | `/api/convert-pdf-to-image` | Convert PDF to image |

---

## 🎨 Customization

### Adding Form Fields
Edit `frontend/src/components/ReportForm.js`

### Modifying PDF Template
Edit `backend/utils/report_generator.py`

### Styling
- App styles: `frontend/src/App.css`
- Form styles: `frontend/src/components/ReportForm.css`
- Preview styles: `frontend/src/components/ReportPreview.css`

---

## 🐛 Troubleshooting

### Port Conflicts
```bash
# Frontend
PORT=3001 npm start

# Backend (edit app.py)
app.run(debug=True, port=5002)
```

### CORS Issues
Ensure Flask-CORS is properly configured in `backend/app.py`

### Build Errors
```bash
# Clear caches
cd frontend && rm -rf node_modules package-lock.json && npm install
cd backend && rm -rf venv && python -m venv venv && pip install -r requirements.txt
```

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

<div align="center">
Made with ❤️ for astrology and vastu enthusiasts
</div>
