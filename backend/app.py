from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from datetime import datetime
import os
from utils.report_generator import ReportGenerator

app = Flask(__name__)

# Configure CORS with specific origins (update in production)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

# Security headers
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

# Configuration
app.config['UPLOAD_FOLDER'] = 'generated_reports'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['JSON_SORT_KEYS'] = False

# Ensure directories exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/generate-report', methods=['POST'])
def generate_report():
    """Generate report from form data"""
    try:
        # Validate request
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400

        data = request.json

        # Validate required fields
        if not data or 'reportType' not in data or 'formData' not in data:
            return jsonify({'error': 'Missing required fields'}), 400

        report_type = data.get('reportType', '').lower()
        form_data = data.get('formData', {})

        # Validate report type
        if report_type not in ['pdf', 'docx', 'excel']:
            return jsonify({'error': 'Invalid report type. Must be pdf, docx, or excel'}), 400

        # Validate form_data is a dictionary
        if not isinstance(form_data, dict):
            return jsonify({'error': 'Form data must be an object'}), 400

        # Initialize report generator
        generator = ReportGenerator()

        # Generate report based on type
        if report_type == 'pdf':
            file_path = generator.generate_pdf(form_data)
        elif report_type == 'docx':
            file_path = generator.generate_docx(form_data)
        elif report_type == 'excel':
            file_path = generator.generate_excel(form_data)

        # Validate file exists
        if not os.path.exists(file_path):
            return jsonify({'error': 'Failed to generate report'}), 500

        # Return file
        return send_file(
            file_path,
            as_attachment=True,
            download_name=os.path.basename(file_path)
        )

    except Exception as e:
        # Log error (in production, use proper logging)
        print(f"Error generating report: {str(e)}")
        return jsonify({'error': 'An error occurred while generating the report'}), 500

@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file size limit exceeded"""
    return jsonify({'error': 'File size too large. Maximum size is 16MB'}), 413

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Note: Set debug=False in production
    app.run(debug=True, port=5001, host='127.0.0.1')
