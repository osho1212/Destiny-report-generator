from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from datetime import datetime
import os
from utils.report_generator import ReportGenerator
from utils.zodiac_mapping import ZODIAC_BODY_MAPPING, get_zodiac_info, get_accessories_for_sign
from utils.vastu_directions import (
    VASTU_DIRECTIONS,
    PLANET_COLORS,
    get_direction_info,
    get_colors_for_direction,
    get_planets_for_direction,
    get_colors_for_planet,
    get_directions_for_planet,
    suggest_colors_for_planets
)
from utils.astro_vastu_logic import (
    PLANET_ZODIAC_CLASSICAL,
    get_body_parts_for_planet,
    get_placement_suggestions_for_direction,
    generate_placement_recommendation,
    generate_removal_recommendation,
    batch_generate_recommendations,
    get_planet_classical_info,
    is_planet_exalted_in_sign,
    is_planet_debilitated_in_sign,
    get_planet_strength_in_sign
)

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

@app.route('/api/zodiac-mapping', methods=['GET'])
def get_zodiac_mapping():
    """Get zodiac sign body part and accessory mapping"""
    try:
        return jsonify({
            'success': True,
            'data': ZODIAC_BODY_MAPPING
        })
    except Exception as e:
        print(f"Error fetching zodiac mapping: {str(e)}")
        return jsonify({'error': 'Failed to fetch zodiac mapping'}), 500

@app.route('/api/zodiac-info/<sign>', methods=['GET'])
def get_sign_info(sign):
    """Get information for a specific zodiac sign"""
    try:
        info = get_zodiac_info(sign)
        if info:
            return jsonify({
                'success': True,
                'sign': sign,
                'data': info
            })
        else:
            return jsonify({'error': f'Zodiac sign "{sign}" not found'}), 404
    except Exception as e:
        print(f"Error fetching sign info: {str(e)}")
        return jsonify({'error': 'Failed to fetch sign information'}), 500

@app.route('/api/zodiac-accessories/<sign>', methods=['GET'])
def get_sign_accessories(sign):
    """Get accessories for a specific zodiac sign"""
    try:
        accessories = get_accessories_for_sign(sign)
        if accessories:
            return jsonify({
                'success': True,
                'sign': sign,
                'accessories': accessories
            })
        else:
            return jsonify({'error': f'Zodiac sign "{sign}" not found'}), 404
    except Exception as e:
        print(f"Error fetching accessories: {str(e)}")
        return jsonify({'error': 'Failed to fetch accessories'}), 500

@app.route('/api/vastu-directions', methods=['GET'])
def get_vastu_directions():
    """Get all 16 Vastu directions with planetary influences and colors"""
    try:
        return jsonify({
            'success': True,
            'data': VASTU_DIRECTIONS
        })
    except Exception as e:
        print(f"Error fetching vastu directions: {str(e)}")
        return jsonify({'error': 'Failed to fetch vastu directions'}), 500

@app.route('/api/vastu-direction/<direction>', methods=['GET'])
def get_vastu_direction_info(direction):
    """Get information for a specific Vastu direction"""
    try:
        info = get_direction_info(direction)
        if info:
            return jsonify({
                'success': True,
                'direction': direction,
                'data': info
            })
        else:
            return jsonify({'error': f'Direction "{direction}" not found'}), 404
    except Exception as e:
        print(f"Error fetching direction info: {str(e)}")
        return jsonify({'error': 'Failed to fetch direction information'}), 500

@app.route('/api/planet-colors', methods=['GET'])
def get_planet_colors_mapping():
    """Get color mapping for all planets"""
    try:
        return jsonify({
            'success': True,
            'data': PLANET_COLORS
        })
    except Exception as e:
        print(f"Error fetching planet colors: {str(e)}")
        return jsonify({'error': 'Failed to fetch planet colors'}), 500

@app.route('/api/planet-colors/<planet>', methods=['GET'])
def get_planet_color_info(planet):
    """Get colors for a specific planet"""
    try:
        colors = get_colors_for_planet(planet)
        if colors:
            return jsonify({
                'success': True,
                'planet': planet,
                'colors': colors
            })
        else:
            return jsonify({'error': f'Planet "{planet}" not found'}), 404
    except Exception as e:
        print(f"Error fetching planet colors: {str(e)}")
        return jsonify({'error': 'Failed to fetch planet colors'}), 500

@app.route('/api/planet-directions/<planet>', methods=['GET'])
def get_planet_directions(planet):
    """Get all directions associated with a planet"""
    try:
        directions = get_directions_for_planet(planet)
        if directions:
            return jsonify({
                'success': True,
                'planet': planet,
                'directions': directions
            })
        else:
            return jsonify({'error': f'Planet "{planet}" not found or has no associated directions'}), 404
    except Exception as e:
        print(f"Error fetching planet directions: {str(e)}")
        return jsonify({'error': 'Failed to fetch planet directions'}), 500

@app.route('/api/suggest-colors', methods=['POST'])
def suggest_colors():
    """Suggest colors based on planets"""
    try:
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400

        data = request.json
        planets = data.get('planets', [])

        if not planets or not isinstance(planets, list):
            return jsonify({'error': 'planets must be a non-empty array'}), 400

        suggestions = suggest_colors_for_planets(planets)
        return jsonify({
            'success': True,
            'suggestions': suggestions
        })
    except Exception as e:
        print(f"Error suggesting colors: {str(e)}")
        return jsonify({'error': 'Failed to suggest colors'}), 500

@app.route('/api/placement-suggestion', methods=['POST'])
def get_placement_suggestion():
    """Get placement suggestion for planet and direction"""
    try:
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400

        data = request.json
        planet = data.get('planet')
        direction = data.get('direction')

        if not planet or not direction:
            return jsonify({'error': 'Both planet and direction are required'}), 400

        recommendation = generate_placement_recommendation(planet, direction)
        return jsonify({
            'success': True,
            'recommendation': recommendation
        })
    except Exception as e:
        print(f"Error generating placement suggestion: {str(e)}")
        return jsonify({'error': 'Failed to generate placement suggestion'}), 500

@app.route('/api/removal-suggestion', methods=['POST'])
def get_removal_suggestion():
    """Get removal suggestion for planet and direction"""
    try:
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400

        data = request.json
        planet = data.get('planet')
        direction = data.get('direction')

        if not planet or not direction:
            return jsonify({'error': 'Both planet and direction are required'}), 400

        recommendation = generate_removal_recommendation(planet, direction)
        return jsonify({
            'success': True,
            'recommendation': recommendation
        })
    except Exception as e:
        print(f"Error generating removal suggestion: {str(e)}")
        return jsonify({'error': 'Failed to generate removal suggestion'}), 500

@app.route('/api/batch-recommendations', methods=['POST'])
def get_batch_recommendations():
    """Get batch recommendations for multiple planet-direction combinations"""
    try:
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400

        data = request.json
        placements = data.get('placements', [])
        action = data.get('action', 'place')  # 'place' or 'remove'

        if not placements or not isinstance(placements, list):
            return jsonify({'error': 'placements must be a non-empty array'}), 400

        if action not in ['place', 'remove']:
            return jsonify({'error': 'action must be either "place" or "remove"'}), 400

        recommendations = batch_generate_recommendations(placements, action)
        return jsonify({
            'success': True,
            'action': action,
            'recommendations': recommendations
        })
    except Exception as e:
        print(f"Error generating batch recommendations: {str(e)}")
        return jsonify({'error': 'Failed to generate batch recommendations'}), 500

@app.route('/api/direction-suggestions/<direction>', methods=['GET'])
def get_direction_suggestions(direction):
    """Get complete placement suggestions for a direction"""
    try:
        suggestions = get_placement_suggestions_for_direction(direction)
        if suggestions:
            return jsonify({
                'success': True,
                'suggestions': suggestions
            })
        else:
            return jsonify({'error': f'Direction "{direction}" not found'}), 404
    except Exception as e:
        print(f"Error fetching direction suggestions: {str(e)}")
        return jsonify({'error': 'Failed to fetch direction suggestions'}), 500

@app.route('/api/planet-classical', methods=['GET'])
def get_all_planets_classical():
    """Get classical information for all planets"""
    try:
        return jsonify({
            'success': True,
            'data': PLANET_ZODIAC_CLASSICAL
        })
    except Exception as e:
        print(f"Error fetching classical planet data: {str(e)}")
        return jsonify({'error': 'Failed to fetch classical planet data'}), 500

@app.route('/api/planet-classical/<planet>', methods=['GET'])
def get_planet_classical(planet):
    """Get classical information for a specific planet"""
    try:
        info = get_planet_classical_info(planet)
        if info:
            return jsonify({
                'success': True,
                'planet': planet,
                'data': info
            })
        else:
            return jsonify({'error': f'Planet "{planet}" not found'}), 404
    except Exception as e:
        print(f"Error fetching planet classical info: {str(e)}")
        return jsonify({'error': 'Failed to fetch planet classical info'}), 500

@app.route('/api/planet-strength', methods=['POST'])
def check_planet_strength():
    """Check planet strength in a zodiac sign"""
    try:
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400

        data = request.json
        planet = data.get('planet')
        sign = data.get('sign')

        if not planet or not sign:
            return jsonify({'error': 'Both planet and sign are required'}), 400

        strength = get_planet_strength_in_sign(planet, sign)
        is_exalted = is_planet_exalted_in_sign(planet, sign)
        is_debilitated = is_planet_debilitated_in_sign(planet, sign)

        return jsonify({
            'success': True,
            'planet': planet,
            'sign': sign,
            'strength': strength,
            'is_exalted': is_exalted,
            'is_debilitated': is_debilitated
        })
    except Exception as e:
        print(f"Error checking planet strength: {str(e)}")
        return jsonify({'error': 'Failed to check planet strength'}), 500

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
