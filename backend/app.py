from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from datetime import datetime
import os
import re
import json
from io import BytesIO
from PyPDF2 import PdfReader
from PIL import Image as PILImage
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

@app.route('/api/extract-pdf-data', methods=['POST'])
def extract_pdf_data():
    """Extract client data from uploaded Kundli PDF"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']

        # Validate file
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'File must be a PDF'}), 400

        # Read PDF
        pdf_reader = PdfReader(BytesIO(file.read()))

        # Extract text from first page
        if len(pdf_reader.pages) == 0:
            return jsonify({'error': 'PDF has no pages'}), 400

        first_page = pdf_reader.pages[0]
        text = first_page.extract_text()

        # Log the extracted text for debugging
        print("=" * 80)
        print("EXTRACTED PDF TEXT:")
        print(text)
        print("=" * 80)

        # Initialize extracted data
        extracted_data = {}

        # Extract Name - look for various patterns
        name_patterns = [
            r'Name[:\s]*([A-Za-z\s\.]+?)(?:\s*(?:DOB|Date of Birth|TOB|POB|Gender|Male|Female|\n|$))',
            r'Client[:\s]*([A-Za-z\s\.]+?)(?:\s*(?:DOB|Date of Birth|\n|$))',
            r'Name[:\s]+([A-Za-z\s\.]+)',  # More lenient
        ]

        for pattern in name_patterns:
            name_match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
            if name_match and name_match.group(1):
                name = name_match.group(1).strip()
                # Clean up and validate
                name = re.sub(r'\s+', ' ', name)
                if len(name) > 2:
                    extracted_data['name'] = name
                    print(f"Found Name match: {name}")
                    break

        # Extract DOB - various date formats
        dob_patterns = [
            r'DOB[:\s]*(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4})',
            r'Date of Birth[:\s]*(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4})',
            r'Birth Date[:\s]*(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4})',
            r'D\.O\.B[:\s]*(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4})',
            r'DOB[:\s]*(\d{1,2}\s+[A-Za-z]+\s+\d{2,4})',  # Format: 15 January 1990
            r'Date of Birth[:\s]*(\d{1,2}\s+[A-Za-z]+\s+\d{2,4})',
            r'DOB\s*[:\-]?\s*(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4})',  # Flexible spacing
            r'(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{4})',  # Just a date pattern anywhere in first part
        ]

        for pattern in dob_patterns:
            dob_match = re.search(pattern, text, re.IGNORECASE)
            if dob_match and dob_match.group(1):
                date_str = dob_match.group(1)
                print(f"Found DOB match: {date_str}")

                # Try to parse date with different formats
                try:
                    # Check if it contains text month name
                    if re.search(r'[A-Za-z]', date_str):
                        from datetime import datetime
                        # Try formats like "15 January 1990" or "15 Jan 1990"
                        for fmt in ['%d %B %Y', '%d %b %Y', '%d-%B-%Y', '%d-%b-%Y']:
                            try:
                                dt = datetime.strptime(date_str.strip(), fmt)
                                extracted_data['dateOfBirth'] = dt.strftime('%Y-%m-%d')
                                break
                            except:
                                continue
                    else:
                        # Numeric date format
                        date_parts = re.split(r'[-/\.]', date_str)
                        if len(date_parts) == 3:
                            day = date_parts[0].zfill(2)
                            month = date_parts[1].zfill(2)
                            year = date_parts[2]

                            # Handle 2-digit year
                            if len(year) == 2:
                                year = '19' + year if int(year) > 50 else '20' + year

                            extracted_data['dateOfBirth'] = f"{year}-{month}-{day}"

                    if 'dateOfBirth' in extracted_data:
                        break
                except Exception as e:
                    print(f"Error parsing date: {e}")
                    continue

        # Extract TOB - time of birth
        tob_patterns = [
            r'TOB[:\s]*(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)',
            r'Time of Birth[:\s]*(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)',
            r'Birth Time[:\s]*(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)',
            r'T\.O\.B[:\s]*(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)',
        ]

        for pattern in tob_patterns:
            tob_match = re.search(pattern, text, re.IGNORECASE)
            if tob_match and tob_match.group(1):
                extracted_data['timeOfBirth'] = tob_match.group(1).strip()
                break

        # Extract POB - place of birth
        pob_patterns = [
            r'POB[:\s]*([A-Za-z\s,\-\.()]+?)(?=TOB|Time of Birth|State|Country|Latitude|Longitude|Time Zone|\n|$)',  # Handle concatenated POB:AhmedabadTOB
            r'Place of Birth[:\s]*([A-Za-z\s,\-\.()]+?)(?=\s*(?:State|Country|Latitude|\n|$))',
            r'Birth Place[:\s]*([A-Za-z\s,\-\.()]+?)(?=\s*(?:State|Country|\n|$))',
            r'P\.O\.B[:\s]*([A-Za-z\s,\-\.()]+?)(?=\s*(?:State|Country|\n|$))',
        ]

        for pattern in pob_patterns:
            pob_match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
            if pob_match and pob_match.group(1):
                place = pob_match.group(1).strip()
                # Remove "TOB" if it got captured at the end
                place = re.sub(r'TOB$', '', place, flags=re.IGNORECASE).strip()
                print(f"Found POB match: {place}")
                # Clean up the place name (remove trailing dots, extra spaces, etc.)
                place = re.sub(r'\s+', ' ', place)
                place = place.rstrip('.,')
                if len(place) > 2:  # Make sure it's not just whitespace or single char
                    extracted_data['placeOfBirth'] = place
                    break

        # Return extracted data
        return jsonify({
            'success': True,
            'data': extracted_data,
            'extractedText': text[:500]  # First 500 chars for debugging
        })

    except Exception as e:
        print(f"Error extracting PDF data: {str(e)}")
        return jsonify({'error': f'Failed to extract PDF data: {str(e)}'}), 500

@app.route('/api/convert-pdf-to-image', methods=['POST'])
def convert_pdf_to_image():
    """Convert PDF pages to images"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        print(f"Converting PDF to images: {file.filename}")

        # Import pdf2image
        from pdf2image import convert_from_bytes
        import base64

        # Read PDF file
        pdf_bytes = file.read()

        print(f"PDF file size: {len(pdf_bytes)} bytes")

        # Convert PDF pages to images with poppler path
        try:
            images = convert_from_bytes(pdf_bytes, dpi=200, fmt='jpeg')
            print(f"Successfully converted PDF to {len(images)} images")
        except Exception as conv_error:
            print(f"Error in convert_from_bytes: {str(conv_error)}")
            # Try with explicit poppler path
            images = convert_from_bytes(
                pdf_bytes,
                dpi=200,
                fmt='jpeg',
                poppler_path='/opt/homebrew/bin'
            )
            print(f"Successfully converted PDF to {len(images)} images (with explicit poppler path)")

        # Convert images to base64
        image_base64_list = []
        for img in images:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'P'):
                rgb_img = PILImage.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                rgb_img.paste(img, mask=img.split()[3] if img.mode == 'RGBA' else None)
                img = rgb_img

            # Save to BytesIO as JPEG
            img_io = BytesIO()
            img.save(img_io, 'JPEG', quality=95, optimize=False, subsampling=0)
            img_io.seek(0)

            # Convert to base64
            img_base64 = base64.b64encode(img_io.read()).decode('utf-8')
            image_base64_list.append(f'data:image/jpeg;base64,{img_base64}')

        return jsonify({
            'success': True,
            'images': image_base64_list,
            'pageCount': len(image_base64_list)
        })

    except ImportError:
        return jsonify({'error': 'pdf2image library not installed. Please run: pip install pdf2image'}), 500
    except Exception as e:
        print(f"Error converting PDF to image: {str(e)}")
        return jsonify({'error': f'Failed to convert PDF: {str(e)}'}), 500

@app.route('/api/convert-pdf-pages-to-images', methods=['POST'])
def convert_pdf_pages_to_images():
    """Convert specific PDF pages to images"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Get page numbers to extract
        pages_json = request.form.get('pages', '[1, 3, 4]')
        page_numbers = json.loads(pages_json)

        print(f"Converting specific pages from PDF: {file.filename}, pages: {page_numbers}")

        # Import required modules
        from pdf2image import convert_from_bytes
        import base64

        # Read PDF file
        pdf_bytes = file.read()

        print(f"PDF file size: {len(pdf_bytes)} bytes")

        # Convert specific PDF pages to images with poppler path
        try:
            # Convert all pages first
            all_images = convert_from_bytes(pdf_bytes, dpi=200, fmt='jpeg')
            print(f"Total pages in PDF: {len(all_images)}")

            # Extract only requested pages (1-indexed to 0-indexed)
            selected_images = []
            for page_num in page_numbers:
                if 1 <= page_num <= len(all_images):
                    selected_images.append(all_images[page_num - 1])
                    print(f"Extracted page {page_num}")
                else:
                    print(f"Warning: Page {page_num} does not exist (total pages: {len(all_images)})")

            print(f"Successfully extracted {len(selected_images)} pages")
        except Exception as conv_error:
            print(f"Error in convert_from_bytes: {str(conv_error)}")
            # Try with explicit poppler path
            all_images = convert_from_bytes(
                pdf_bytes,
                dpi=200,
                fmt='jpeg',
                poppler_path='/opt/homebrew/bin'
            )
            selected_images = []
            for page_num in page_numbers:
                if 1 <= page_num <= len(all_images):
                    selected_images.append(all_images[page_num - 1])

        # Convert images to base64
        image_base64_list = []
        for img in selected_images:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'P'):
                rgb_img = PILImage.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                rgb_img.paste(img, mask=img.split()[3] if img.mode == 'RGBA' else None)
                img = rgb_img

            # Save to BytesIO as JPEG
            img_io = BytesIO()
            img.save(img_io, 'JPEG', quality=95, optimize=False, subsampling=0)
            img_io.seek(0)

            # Convert to base64
            img_base64 = base64.b64encode(img_io.read()).decode('utf-8')
            image_base64_list.append(f'data:image/jpeg;base64,{img_base64}')

        return jsonify({
            'success': True,
            'images': image_base64_list,
            'pageCount': len(image_base64_list)
        })

    except ImportError:
        return jsonify({'error': 'pdf2image library not installed. Please run: pip install pdf2image'}), 500
    except Exception as e:
        print(f"Error converting PDF pages to images: {str(e)}")
        return jsonify({'error': f'Failed to convert PDF pages: {str(e)}'}), 500

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
        custom_filename = data.get('filename', None)

        # Validate report type
        if report_type not in ['pdf', 'docx', 'excel']:
            return jsonify({'error': 'Invalid report type. Must be pdf, docx, or excel'}), 400

        # Validate form_data is a dictionary
        if not isinstance(form_data, dict):
            return jsonify({'error': 'Form data must be an object'}), 400

        # Initialize report generator
        generator = ReportGenerator()

        # Generate report - only PDF is supported
        if report_type == 'pdf':
            file_path = generator.generate_pdf(form_data)
        else:
            return jsonify({'error': 'Only PDF export is supported'}), 400

        # Validate file exists
        if not os.path.exists(file_path):
            return jsonify({'error': 'Failed to generate report'}), 500

        # Determine download filename
        if custom_filename:
            # Sanitize filename to prevent directory traversal
            safe_filename = os.path.basename(custom_filename)
            extension = report_type if report_type != 'excel' else 'xlsx'
            download_filename = f"{safe_filename}.{extension}"
        else:
            download_filename = os.path.basename(file_path)

        # Return file
        return send_file(
            file_path,
            as_attachment=True,
            download_name=download_filename
        )

    except Exception as e:
        # Log error (in production, use proper logging)
        import traceback
        print(f"Error generating report: {str(e)}")
        print(traceback.format_exc())
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
