# Destiny Report Generator

A full-stack application for generating custom reports from form data. Built with React (frontend) and Python Flask (backend).

## Features

- 📝 Dynamic form with validation
- 📄 Multiple export formats (PDF, Word, Excel)
- 🎨 Modern, responsive UI
- ⚡ Fast report generation
- 🔄 Real-time form validation

## Tech Stack

### Frontend
- React 18
- React Hook Form (form handling & validation)
- Axios (HTTP client)
- CSS3 (styling)

### Backend
- Python 3.8+
- Flask (web framework)
- python-docx (Word documents)
- ReportLab (PDF generation)
- openpyxl (Excel files)
- Jinja2 (templating)

## Project Structure

```
Destiny Report Generator/
├── backend/
│   ├── app.py                      # Flask application entry point
│   ├── requirements.txt            # Python dependencies
│   ├── utils/
│   │   └── report_generator.py    # Report generation logic
│   ├── templates/                  # Custom templates (optional)
│   └── generated_reports/          # Output directory for reports
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── ReportForm.js       # Main form component
    │   │   └── ReportForm.css
    │   ├── services/
    │   │   └── apiService.js       # API communication
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- pip

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment (recommended):
```bash
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
```bash
python app.py
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Usage

1. Make sure both backend (Flask) and frontend (React) servers are running
2. Open your browser and go to `http://localhost:3000`
3. Fill in the form with your information
4. Select desired report format (PDF, Word, or Excel)
5. Click "Generate Report"
6. The report will automatically download

## API Endpoints

### Health Check
```
GET /api/health
```

### Generate Report
```
POST /api/generate-report
Body: {
  "reportType": "pdf|docx|excel",
  "formData": { ... }
}
```

### Get Templates
```
GET /api/templates
```

## Customization

### Adding Custom Form Fields

Edit [frontend/src/components/ReportForm.js](frontend/src/components/ReportForm.js) to add new fields.

### Customizing Report Templates

Modify the report generation logic in [backend/utils/report_generator.py](backend/utils/report_generator.py).

### Styling

- Main styles: [frontend/src/App.css](frontend/src/App.css)
- Form styles: [frontend/src/components/ReportForm.css](frontend/src/components/ReportForm.css)
- Global styles: [frontend/src/index.css](frontend/src/index.css)

## Development

### Backend Development
- The Flask server runs in debug mode by default
- Changes to Python files will auto-reload the server

### Frontend Development
- React hot reload is enabled
- Changes will reflect immediately in the browser

## Building for Production

### Frontend
```bash
cd frontend
npm run build
```

The optimized build will be in the `frontend/build` directory.

### Backend
For production, use a WSGI server like Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Troubleshooting

### Port already in use
- Backend: Change port in [backend/app.py](backend/app.py)
- Frontend: Change port with `PORT=3001 npm start`

### CORS errors
- Ensure Flask-CORS is installed and configured in [backend/app.py](backend/app.py)

### Module not found
- Backend: Make sure virtual environment is activated and dependencies are installed
- Frontend: Run `npm install` again

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
