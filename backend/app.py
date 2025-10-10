from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from datetime import datetime
import os
from utils.report_generator import ReportGenerator

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
app.config['UPLOAD_FOLDER'] = 'generated_reports'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

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
        data = request.json
        report_type = data.get('reportType', 'pdf')  # pdf, docx, or excel
        form_data = data.get('formData', {})

        # Initialize report generator
        generator = ReportGenerator()

        # Generate report based on type
        if report_type == 'pdf':
            file_path = generator.generate_pdf(form_data)
        elif report_type == 'docx':
            file_path = generator.generate_docx(form_data)
        elif report_type == 'excel':
            file_path = generator.generate_excel(form_data)
        else:
            return jsonify({'error': 'Invalid report type'}), 400

        # Return file
        return send_file(
            file_path,
            as_attachment=True,
            download_name=os.path.basename(file_path)
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/templates', methods=['GET'])
def get_templates():
    """Get list of available templates"""
    try:
        templates_dir = 'templates'
        templates = []

        if os.path.exists(templates_dir):
            for file in os.listdir(templates_dir):
                if file.endswith(('.html', '.docx', '.xlsx')):
                    templates.append({
                        'name': file,
                        'type': file.split('.')[-1]
                    })

        return jsonify({'templates': templates})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
