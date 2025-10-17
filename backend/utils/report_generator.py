from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.graphics.shapes import Drawing, Line
from openpyxl import Workbook
from jinja2 import Template
from datetime import datetime
import os
import html
import base64
import io
from PyPDF2 import PdfReader, PdfWriter

class ReportGenerator:
    def __init__(self):
        self.output_dir = 'generated_reports'
        os.makedirs(self.output_dir, exist_ok=True)

    def sanitize_input(self, text):
        """Sanitize user input to prevent XSS and injection attacks"""
        if not text:
            return ''
        return html.escape(str(text))

    def format_dasha(self, form_data, prefix):
        """Format dasha data from form fields
        Format: Planet(Source), NL(NL Source), (Additional house), SL(SL source)
        If no_star is True for the dasha, add * as superscript to the first planet
        """
        planet = self.sanitize_input(form_data.get(f'{prefix}_planet', ''))
        source = self.sanitize_input(form_data.get(f'{prefix}_source', ''))
        nl = self.sanitize_input(form_data.get(f'{prefix}_nl', ''))
        nl_source = self.sanitize_input(form_data.get(f'{prefix}_nl_source', ''))
        additional_house = self.sanitize_input(form_data.get(f'{prefix}_additional_house', ''))
        sl = self.sanitize_input(form_data.get(f'{prefix}_sl', ''))
        sl_source = self.sanitize_input(form_data.get(f'{prefix}_sl_source', ''))
        no_star = form_data.get(f'{prefix}_no_star', False)

        parts = []

        # Planet(Source) - add * if no_star is True
        if planet:
            planet_text = planet
            if no_star:
                planet_text = f'{planet}*'

            if source:
                parts.append(f'{planet_text}({source})')
            else:
                parts.append(planet_text)

        # NL Planet(NL Source)
        if nl:
            if nl_source:
                parts.append(f'{nl}({nl_source})')
            else:
                parts.append(nl)

        # (Additional house)
        if additional_house:
            parts.append(f'({additional_house})')

        # SL Planet(SL source)
        if sl:
            if sl_source:
                parts.append(f'{sl}({sl_source})')
            else:
                parts.append(sl)

        # Add period dates if this is pratyantardasha
        if prefix == 'pratyantardasha':
            period_from = self.sanitize_input(form_data.get(f'{prefix}_period_from', ''))
            period_to = self.sanitize_input(form_data.get(f'{prefix}_period_to', ''))

            if period_from and period_to:
                # Format dates
                from datetime import datetime as dt
                try:
                    from_date = dt.strptime(period_from, '%Y-%m-%d').strftime('%b %d, %Y')
                    to_date = dt.strptime(period_to, '%Y-%m-%d').strftime('%b %d, %Y')
                    parts.append(f'Period: {from_date} - {to_date}')
                except:
                    # If date parsing fails, use raw values
                    parts.append(f'Period: {period_from} - {period_to}')

        return ', '.join(parts) if parts else ''

    def generate_pdf(self, form_data):
        """Generate PDF Destiny Report from form data"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        client_name = self.sanitize_input(form_data.get('name', 'Client')).replace(' ', '_')
        filename = f'destiny_report_{client_name}_{timestamp}.pdf'
        filepath = os.path.join(self.output_dir, filename)

        # Create PDF
        doc = SimpleDocTemplate(filepath, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
        styles = getSampleStyleSheet()
        story = []

        # Main Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=colors.HexColor('#2c3e50'),
            spaceAfter=30,
            alignment=1,
            fontName='Times-Bold'
        )
        story.append(Paragraph("DESTINY REPORT", title_style))
        story.append(Spacer(1, 0.5*inch))

        # Section Title Style - orange color matching preview, Times New Roman
        section_style = ParagraphStyle(
            'SectionTitle',
            parent=styles['Heading2'],
            fontSize=18,
            textColor=colors.HexColor('#ff8c00'),
            spaceBefore=30,
            spaceAfter=16,
            fontName='Times-Bold'
        )

        # Field Label Style - Times New Roman, bold
        field_label_style = ParagraphStyle(
            'FieldLabel',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=4,
            fontName='Times-Bold',
            textColor=colors.HexColor('#333333')
        )

        # Field Value Style - Times New Roman, with bullet points
        field_value_style = ParagraphStyle(
            'FieldValue',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=12,
            fontName='Times-Roman',
            leftIndent=20,
            bulletIndent=10,
            bulletFontName='Times-Roman'
        )

        # Field Style - Times New Roman (for combined label+value)
        field_style = ParagraphStyle(
            'FieldStyle',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=12,
            fontName='Times-Roman',
            leftIndent=15
        )

        # Helper function to format multi-line values with bullet points
        def format_value_with_bullets(value):
            """Format values that contain multiple lines or comma-separated items with bullets"""
            if not value:
                return []

            # Check if value contains newlines or commas suggesting multiple items
            if '\n' in value:
                items = [item.strip() for item in value.split('\n') if item.strip()]
            elif ',' in value and len(value) > 50:  # Only split by comma if text is long
                items = [item.strip() for item in value.split(',') if item.strip()]
            else:
                # Single value, no bullets needed
                return [value]

            return items if len(items) > 1 else [value]

        # Helper function to add section (only if it has content)
        def add_section(title, fields, keep_inline=False):
            # Check if any field has a value
            has_content = any(self.sanitize_input(form_data.get(field_key, '')) for field_key, _ in fields)

            if not has_content:
                return  # Skip empty sections

            story.append(Paragraph(title, section_style))

            # Add orange separation line under section title
            d = Drawing(6.5*inch, 2)
            line = Line(0, 1, 6.5*inch, 1)
            line.strokeColor = colors.HexColor('#ff8c00')
            line.strokeWidth = 2
            d.add(line)
            story.append(d)
            story.append(Spacer(1, 0.15*inch))

            for field_key, field_label in fields:
                value = self.sanitize_input(form_data.get(field_key, ''))
                if value:
                    if keep_inline:
                        # Keep label and value on same line (for About the Client)
                        text = f"<b>{field_label}:</b> {value}"
                        story.append(Paragraph(text, field_style))
                    else:
                        # Add field label
                        story.append(Paragraph(f"<b>{field_label}:</b>", field_label_style))

                        # Format value with bullets if multi-line
                        items = format_value_with_bullets(value)
                        if len(items) > 1:
                            # Multiple items - use bullets
                            for item in items:
                                bullet_text = f"• {item}"
                                story.append(Paragraph(bullet_text, field_value_style))
                        else:
                            # Single item - no bullet
                            story.append(Paragraph(items[0], field_value_style))

                    story.append(Spacer(1, 0.08*inch))

            story.append(Spacer(1, 0.25*inch))

        # ABOUT THE CLIENT
        add_section("ABOUT THE CLIENT", [
            ('name', 'Name'),
            ('dateOfBirth', 'Date of Birth'),
            ('timeOfBirth', 'Time of Birth'),
            ('placeOfBirth', 'Place of Birth')
        ])

        # VASTU ANALYSIS
        add_section("VASTU ANALYSIS", [
            ('mapOfHouse', 'Map of the House'),
            ('vastuAnalysis', 'Analysis (Entrances, Kitchen, Washrooms)'),
            ('vastuRemedies', 'Remedies')
        ])

        # ASTROLOGY (Custom handling for Dashas)
        # Check if ASTROLOGY section has any content
        mahadasha = self.format_dasha(form_data, 'mahadasha')
        antardasha = self.format_dasha(form_data, 'antardasha')
        pratyantardasha = self.format_dasha(form_data, 'pratyantardasha')

        astrology_fields = [
            'donationsToDo', 'donationsToWhom', 'gemstones', 'mantra',
            'birthNakshatra', 'mobileDisplayPicture', 'beneficialSymbols',
            'nakshatraProsperitySymbols', 'nakshatraMentalPhysicalWellbeing',
            'nakshatraAccomplishments', 'nakshatraAvoidSymbols'
        ]

        has_astrology_content = (
            mahadasha or antardasha or pratyantardasha or
            any(self.sanitize_input(form_data.get(field, '')) for field in astrology_fields)
        )

        if has_astrology_content:
            story.append(Paragraph("ASTROLOGY", section_style))

            # Add orange separation line under section title
            d = Drawing(6.5*inch, 2)
            line = Line(0, 1, 6.5*inch, 1)
            line.strokeColor = colors.HexColor('#ff8c00')
            line.strokeWidth = 2
            d.add(line)
            story.append(d)
            story.append(Spacer(1, 0.15*inch))

            # Add Mahadasha
            if mahadasha:
                story.append(Paragraph("<b>Mahadasha:</b>", field_label_style))
                story.append(Paragraph(mahadasha, field_value_style))
                story.append(Spacer(1, 0.08*inch))

            # Add Antardasha
            if antardasha:
                story.append(Paragraph("<b>Antardasha:</b>", field_label_style))
                story.append(Paragraph(antardasha, field_value_style))
                story.append(Spacer(1, 0.08*inch))

            # Add Pratyantardasha
            if pratyantardasha:
                story.append(Paragraph("<b>Pratyantar Dasha:</b>", field_label_style))
                story.append(Paragraph(pratyantardasha, field_value_style))
                story.append(Spacer(1, 0.08*inch))

            # Add other astrology fields
            for field_key, field_label in [
                ('donationsToDo', 'Donations to Do'),
                ('donationsToWhom', 'Donations - To Whom'),
                ('gemstones', 'Gemstones'),
                ('mantra', 'Mantra to Make Situation Positive'),
                ('birthNakshatra', 'Your Birth Nakshatra'),
                ('mobileDisplayPicture', 'Beneficial Mobile Display Picture'),
                ('beneficialSymbols', 'Most Beneficial Symbols'),
                ('nakshatraProsperitySymbols', 'Prosperity Giving Symbols'),
                ('nakshatraMentalPhysicalWellbeing', 'Mental/Physical Wellbeing Symbols'),
                ('nakshatraAccomplishments', 'Accomplishment/Achievement Symbols'),
                ('nakshatraAvoidSymbols', 'Symbols to Avoid')
            ]:
                value = self.sanitize_input(form_data.get(field_key, ''))
                if value:
                    # Add field label
                    story.append(Paragraph(f"<b>{field_label}:</b>", field_label_style))

                    # Format value with bullets if multi-line
                    items = format_value_with_bullets(value)
                    if len(items) > 1:
                        # Multiple items - use bullets
                        for item in items:
                            bullet_text = f"• {item}"
                            story.append(Paragraph(bullet_text, field_value_style))
                    else:
                        # Single item - no bullet
                        story.append(Paragraph(items[0], field_value_style))

                    story.append(Spacer(1, 0.08*inch))

            story.append(Spacer(1, 0.25*inch))

        # ASTRO VASTU SOLUTION
        add_section("ASTRO VASTU SOLUTION", [
            ('aspectsOnHouses', 'Aspects on Houses'),
            ('aspectsOnPlanets', 'Aspects on Planets'),
            ('whatToRemove', 'What to Remove from Which Directions'),
            ('whatToPlace', 'What to Place in Which Directions'),
            ('astroVastuRemediesBody', 'Astro Vastu Remedies for Body'),
            ('colorObjectsToUse', 'What Color or Objects to Use on Body'),
            ('colorObjectsNotToUse', 'What Color or Objects NOT to Use on Body'),
            ('lockerLocation', 'Most Favorable Location of Locker'),
            ('laughingBuddhaDirection', 'Placement of Laughing Buddha/Vision Board - Direction'),
            ('wishListInkColor', 'Color of Ink to Write Wish List')
        ])

        # GUIDELINES
        add_section("GUIDELINES", [
            ('neverCriticize', 'To Whom You Should Never Criticize or Judge'),
            ('importantBooks', 'Important Books to Read to Uplift Your Life'),
            ('giftsToGive', 'Gifts - To Give'),
            ('giftsToReceive', 'Gifts - To Receive')
        ])

        # BHRIGUNANDA NADI
        add_section("BHRIGUNANDA NADI", [
            ('saturnRelation', 'Saturn Relation'),
            ('saturnFollowing', 'Saturn is following'),
            ('professionalMindset', 'Professional Mindset'),
            ('venusRelation', 'Venus Relation'),
            ('venusFollowing', 'Venus is following'),
            ('financialMindset', 'Financial Mindset')
        ])

        # Add timestamp
        story.append(Spacer(1, 0.3*inch))
        timestamp_text = f"Generated on: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}"
        story.append(Paragraph(timestamp_text, styles['Italic']))

        # Build PDF
        doc.build(story)

        # If Kundli PDF is provided, merge specific pages (1, 3, 4) at the beginning
        kundli_pdf_data = form_data.get('kundliPdf')
        kundli_pages = [1, 3, 4]  # Pages to extract from Kundli PDF

        if kundli_pdf_data and kundli_pdf_data.startswith('data:application/pdf'):
            try:
                print(f"Merging Kundli pages {kundli_pages} at the beginning...")

                # Extract base64 data
                pdf_data = kundli_pdf_data.split(',')[1]
                pdf_bytes = base64.b64decode(pdf_data)

                # Read the Kundli PDF
                kundli_reader = PdfReader(io.BytesIO(pdf_bytes))
                print(f"Kundli PDF has {len(kundli_reader.pages)} pages")

                # Read the generated report PDF
                report_reader = PdfReader(filepath)
                print(f"Generated report has {len(report_reader.pages)} pages")

                # Create a new PDF writer
                pdf_writer = PdfWriter()

                # Add selected Kundli pages first (1-indexed to 0-indexed)
                for page_num in kundli_pages:
                    if 1 <= page_num <= len(kundli_reader.pages):
                        pdf_writer.add_page(kundli_reader.pages[page_num - 1])
                        print(f"Added Kundli page {page_num}")

                # Add all pages from the generated report
                for page in report_reader.pages:
                    pdf_writer.add_page(page)

                # Write the merged PDF
                with open(filepath, 'wb') as output_file:
                    pdf_writer.write(output_file)

                print(f"Successfully merged Kundli pages {kundli_pages} at the beginning")
            except Exception as e:
                print(f"Error merging Kundli PDF: {e}")

        return filepath

    def generate_docx(self, form_data):
        """Generate Word Destiny Report from form data"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        client_name = self.sanitize_input(form_data.get('name', 'Client')).replace(' ', '_')
        filename = f'destiny_report_{client_name}_{timestamp}.docx'
        filepath = os.path.join(self.output_dir, filename)

        # Create document
        doc = Document()

        # Add main title with Times New Roman
        title = doc.add_heading('DESTINY REPORT', 0)
        title.alignment = 1  # Center
        for run in title.runs:
            run.font.name = 'Times New Roman'
            run.font.size = Pt(28)
        doc.add_paragraph()

        # Helper function to add orange border line
        def add_orange_line():
            p = doc.add_paragraph()
            pPr = p._element.get_or_add_pPr()
            pBdr = OxmlElement('w:pBdr')
            bottom = OxmlElement('w:bottom')
            bottom.set(qn('w:val'), 'single')
            bottom.set(qn('w:sz'), '12')  # 12/8 = 1.5pt line thickness
            bottom.set(qn('w:space'), '1')
            bottom.set(qn('w:color'), 'FF8C00')  # Orange color
            pBdr.append(bottom)
            pPr.append(pBdr)

        # Helper function to format multi-line values with bullet points
        def format_value_with_bullets_docx(value):
            """Format values that contain multiple lines or comma-separated items with bullets"""
            if not value:
                return []

            # Check if value contains newlines or commas suggesting multiple items
            if '\n' in value:
                items = [item.strip() for item in value.split('\n') if item.strip()]
            elif ',' in value and len(value) > 50:  # Only split by comma if text is long
                items = [item.strip() for item in value.split(',') if item.strip()]
            else:
                # Single value, no bullets needed
                return [value]

            return items if len(items) > 1 else [value]

        # Helper function to add section (only if it has content)
        def add_section(title_text, fields):
            # Check if any field has a value
            has_content = any(self.sanitize_input(form_data.get(field_key, '')) for field_key, _ in fields)

            if not has_content:
                return  # Skip empty sections

            # Add section heading with Times New Roman and orange color
            heading = doc.add_heading(title_text, level=1)
            for run in heading.runs:
                run.font.name = 'Times New Roman'
                run.font.size = Pt(18)
                run.font.color.rgb = RGBColor(255, 140, 0)  # Orange color

            # Add orange separation line
            add_orange_line()
            doc.add_paragraph()  # Add spacing after line

            for field_key, field_label in fields:
                value = self.sanitize_input(form_data.get(field_key, ''))
                if value:
                    # Add field label paragraph
                    label_p = doc.add_paragraph()
                    label_run = label_p.add_run(f'{field_label}:')
                    label_run.bold = True
                    label_run.font.name = 'Times New Roman'
                    label_run.font.size = Pt(11)
                    label_run.font.color.rgb = RGBColor(51, 51, 51)  # Dark gray

                    # Format value with bullets if multi-line
                    items = format_value_with_bullets_docx(value)
                    if len(items) > 1:
                        # Multiple items - use bullets
                        for item in items:
                            p = doc.add_paragraph(item, style='List Bullet')
                            for run in p.runs:
                                run.font.name = 'Times New Roman'
                                run.font.size = Pt(11)
                    else:
                        # Single item - no bullet
                        p = doc.add_paragraph()
                        value_run = p.add_run(items[0])
                        value_run.font.name = 'Times New Roman'
                        value_run.font.size = Pt(11)

                    # Add spacing after each field
                    doc.add_paragraph()

            doc.add_paragraph()  # Extra spacing after section

        # ABOUT THE CLIENT
        add_section("ABOUT THE CLIENT", [
            ('name', 'Name'),
            ('dateOfBirth', 'Date of Birth'),
            ('timeOfBirth', 'Time of Birth'),
            ('placeOfBirth', 'Place of Birth')
        ])

        # VASTU ANALYSIS
        add_section("VASTU ANALYSIS", [
            ('mapOfHouse', 'Map of the House'),
            ('vastuAnalysis', 'Analysis (Entrances, Kitchen, Washrooms)'),
            ('vastuRemedies', 'Remedies')
        ])

        # ASTROLOGY (Custom handling for Dashas)
        # Check if ASTROLOGY section has any content
        mahadasha = self.format_dasha(form_data, 'mahadasha')
        antardasha = self.format_dasha(form_data, 'antardasha')
        pratyantardasha = self.format_dasha(form_data, 'pratyantardasha')

        astrology_fields = [
            'donationsToDo', 'donationsToWhom', 'gemstones', 'mantra',
            'birthNakshatra', 'mobileDisplayPicture', 'beneficialSymbols',
            'nakshatraProsperitySymbols', 'nakshatraMentalPhysicalWellbeing',
            'nakshatraAccomplishments', 'nakshatraAvoidSymbols'
        ]

        has_astrology_content = (
            mahadasha or antardasha or pratyantardasha or
            any(self.sanitize_input(form_data.get(field, '')) for field in astrology_fields)
        )

        if has_astrology_content:
            # Add section heading with Times New Roman and orange color
            heading = doc.add_heading("ASTROLOGY", level=1)
            for run in heading.runs:
                run.font.name = 'Times New Roman'
                run.font.size = Pt(18)
                run.font.color.rgb = RGBColor(255, 140, 0)  # Orange color

            # Add orange separation line
            add_orange_line()
            doc.add_paragraph()  # Add spacing after line

            # Add Mahadasha
            if mahadasha:
                label_p = doc.add_paragraph()
                label_run = label_p.add_run('Mahadasha:')
                label_run.bold = True
                label_run.font.name = 'Times New Roman'
                label_run.font.size = Pt(11)
                label_run.font.color.rgb = RGBColor(51, 51, 51)

                p = doc.add_paragraph()
                value_run = p.add_run(mahadasha)
                value_run.font.name = 'Times New Roman'
                value_run.font.size = Pt(11)
                doc.add_paragraph()

            # Add Antardasha
            if antardasha:
                label_p = doc.add_paragraph()
                label_run = label_p.add_run('Antardasha:')
                label_run.bold = True
                label_run.font.name = 'Times New Roman'
                label_run.font.size = Pt(11)
                label_run.font.color.rgb = RGBColor(51, 51, 51)

                p = doc.add_paragraph()
                value_run = p.add_run(antardasha)
                value_run.font.name = 'Times New Roman'
                value_run.font.size = Pt(11)
                doc.add_paragraph()

            # Add Pratyantardasha
            if pratyantardasha:
                label_p = doc.add_paragraph()
                label_run = label_p.add_run('Pratyantar Dasha:')
                label_run.bold = True
                label_run.font.name = 'Times New Roman'
                label_run.font.size = Pt(11)
                label_run.font.color.rgb = RGBColor(51, 51, 51)

                p = doc.add_paragraph()
                value_run = p.add_run(pratyantardasha)
                value_run.font.name = 'Times New Roman'
                value_run.font.size = Pt(11)
                doc.add_paragraph()

            # Add other astrology fields
            for field_key, field_label in [
                ('donationsToDo', 'Donations to Do'),
                ('donationsToWhom', 'Donations - To Whom'),
                ('gemstones', 'Gemstones'),
                ('mantra', 'Mantra to Make Situation Positive'),
                ('birthNakshatra', 'Your Birth Nakshatra'),
                ('mobileDisplayPicture', 'Beneficial Mobile Display Picture'),
                ('beneficialSymbols', 'Most Beneficial Symbols'),
                ('nakshatraProsperitySymbols', 'Prosperity Giving Symbols'),
                ('nakshatraMentalPhysicalWellbeing', 'Mental/Physical Wellbeing Symbols'),
                ('nakshatraAccomplishments', 'Accomplishment/Achievement Symbols'),
                ('nakshatraAvoidSymbols', 'Symbols to Avoid')
            ]:
                value = self.sanitize_input(form_data.get(field_key, ''))
                if value:
                    # Add field label paragraph
                    label_p = doc.add_paragraph()
                    label_run = label_p.add_run(f'{field_label}:')
                    label_run.bold = True
                    label_run.font.name = 'Times New Roman'
                    label_run.font.size = Pt(11)
                    label_run.font.color.rgb = RGBColor(51, 51, 51)

                    # Format value with bullets if multi-line
                    items = format_value_with_bullets_docx(value)
                    if len(items) > 1:
                        # Multiple items - use bullets
                        for item in items:
                            p = doc.add_paragraph(item, style='List Bullet')
                            for run in p.runs:
                                run.font.name = 'Times New Roman'
                                run.font.size = Pt(11)
                    else:
                        # Single item - no bullet
                        p = doc.add_paragraph()
                        value_run = p.add_run(items[0])
                        value_run.font.name = 'Times New Roman'
                        value_run.font.size = Pt(11)

                    # Add spacing after each field
                    doc.add_paragraph()

            doc.add_paragraph()  # Extra spacing after section

        # ASTRO VASTU SOLUTION
        add_section("ASTRO VASTU SOLUTION", [
            ('aspectsOnHouses', 'Aspects on Houses'),
            ('aspectsOnPlanets', 'Aspects on Planets'),
            ('whatToRemove', 'What to Remove from Which Directions'),
            ('whatToPlace', 'What to Place in Which Directions'),
            ('astroVastuRemediesBody', 'Astro Vastu Remedies for Body'),
            ('colorObjectsToUse', 'What Color or Objects to Use on Body'),
            ('colorObjectsNotToUse', 'What Color or Objects NOT to Use on Body'),
            ('lockerLocation', 'Most Favorable Location of Locker'),
            ('laughingBuddhaDirection', 'Placement of Laughing Buddha/Vision Board - Direction'),
            ('wishListInkColor', 'Color of Ink to Write Wish List')
        ])

        # GUIDELINES
        add_section("GUIDELINES", [
            ('neverCriticize', 'To Whom You Should Never Criticize or Judge'),
            ('importantBooks', 'Important Books to Read to Uplift Your Life'),
            ('giftsToGive', 'Gifts - To Give'),
            ('giftsToReceive', 'Gifts - To Receive')
        ])

        # BHRIGUNANDA NADI
        add_section("BHRIGUNANDA NADI", [
            ('saturnRelation', 'Saturn Relation'),
            ('saturnFollowing', 'Saturn is following'),
            ('professionalMindset', 'Professional Mindset'),
            ('venusRelation', 'Venus Relation'),
            ('venusFollowing', 'Venus is following'),
            ('financialMindset', 'Financial Mindset')
        ])

        # Add timestamp
        timestamp_para = doc.add_paragraph(
            f"Generated on: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}"
        )
        timestamp_para.runs[0].italic = True

        # Save document
        doc.save(filepath)
        return filepath

    def generate_excel(self, form_data):
        """Generate Excel Destiny Report from form data"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        client_name = self.sanitize_input(form_data.get('name', 'Client')).replace(' ', '_')
        filename = f'destiny_report_{client_name}_{timestamp}.xlsx'
        filepath = os.path.join(self.output_dir, filename)

        # Create workbook
        wb = Workbook()
        ws = wb.active
        ws.title = "Destiny Report"

        # Add main title
        ws['A1'] = 'DESTINY REPORT'
        ws['A1'].font = ws['A1'].font.copy(size=18, bold=True)
        ws.merge_cells('A1:B1')

        row = 3

        # Helper function to add section
        def add_section(title, fields):
            nonlocal row
            # Section title
            ws[f'A{row}'] = title
            ws[f'A{row}'].font = ws[f'A{row}'].font.copy(size=14, bold=True)
            ws.merge_cells(f'A{row}:B{row}')
            row += 1

            # Section fields
            for field_key, field_label in fields:
                value = self.sanitize_input(form_data.get(field_key, ''))
                if value:
                    ws[f'A{row}'] = field_label
                    ws[f'B{row}'] = str(value)
                    ws[f'A{row}'].font = ws[f'A{row}'].font.copy(bold=True)
                    row += 1

            row += 1  # Add space after section

        # ABOUT THE CLIENT
        add_section("ABOUT THE CLIENT", [
            ('name', 'Name'),
            ('dateOfBirth', 'Date of Birth'),
            ('timeOfBirth', 'Time of Birth'),
            ('placeOfBirth', 'Place of Birth')
        ])

        # VASTU ANALYSIS
        add_section("VASTU ANALYSIS", [
            ('mapOfHouse', 'Map of the House'),
            ('vastuAnalysis', 'Analysis (Entrances, Kitchen, Washrooms)'),
            ('vastuRemedies', 'Remedies')
        ])

        # ASTROLOGY
        ws[f'A{row}'] = "ASTROLOGY"
        ws[f'A{row}'].font = ws[f'A{row}'].font.copy(size=14, bold=True)
        ws.merge_cells(f'A{row}:B{row}')
        row += 1

        # Add Mahadasha
        mahadasha = self.format_dasha(form_data, 'mahadasha')
        if mahadasha:
            ws[f'A{row}'] = 'Mahadasha'
            ws[f'B{row}'] = mahadasha
            ws[f'A{row}'].font = ws[f'A{row}'].font.copy(bold=True)
            row += 1

        # Add Antardasha
        antardasha = self.format_dasha(form_data, 'antardasha')
        if antardasha:
            ws[f'A{row}'] = 'Antardasha'
            ws[f'B{row}'] = antardasha
            ws[f'A{row}'].font = ws[f'A{row}'].font.copy(bold=True)
            row += 1

        # Add Pratyantardasha
        pratyantardasha = self.format_dasha(form_data, 'pratyantardasha')
        if pratyantardasha:
            ws[f'A{row}'] = 'Pratyantar Dasha'
            ws[f'B{row}'] = pratyantardasha
            ws[f'A{row}'].font = ws[f'A{row}'].font.copy(bold=True)
            row += 1

        # Add other astrology fields
        for field_key, field_label in [
            ('donationsToDo', 'Donations to Do'),
            ('donationsToWhom', 'Donations - To Whom'),
            ('gemstones', 'Gemstones'),
            ('mantra', 'Mantra to Make Situation Positive'),
            ('birthNakshatra', 'Your Birth Nakshatra'),
            ('mobileDisplayPicture', 'Beneficial Mobile Display Picture'),
            ('beneficialSymbols', 'Most Beneficial Symbols'),
            ('nakshatraProsperitySymbols', 'Prosperity Giving Symbols'),
            ('nakshatraMentalPhysicalWellbeing', 'Mental/Physical Wellbeing Symbols'),
            ('nakshatraAccomplishments', 'Accomplishment/Achievement Symbols'),
            ('nakshatraAvoidSymbols', 'Symbols to Avoid')
        ]:
            value = self.sanitize_input(form_data.get(field_key, ''))
            if value:
                ws[f'A{row}'] = field_label
                ws[f'B{row}'] = str(value)
                ws[f'A{row}'].font = ws[f'A{row}'].font.copy(bold=True)
                row += 1

        row += 1

        # ASTRO VASTU SOLUTION
        add_section("ASTRO VASTU SOLUTION", [
            ('aspectsOnHouses', 'Aspects on Houses'),
            ('aspectsOnPlanets', 'Aspects on Planets'),
            ('whatToRemove', 'What to Remove from Which Directions'),
            ('whatToPlace', 'What to Place in Which Directions'),
            ('astroVastuRemediesBody', 'Astro Vastu Remedies for Body'),
            ('colorObjectsToUse', 'What Color or Objects to Use on Body'),
            ('colorObjectsNotToUse', 'What Color or Objects NOT to Use on Body'),
            ('lockerLocation', 'Most Favorable Location of Locker'),
            ('laughingBuddhaDirection', 'Placement of Laughing Buddha/Vision Board - Direction'),
            ('wishListInkColor', 'Color of Ink to Write Wish List')
        ])

        # GUIDELINES
        add_section("GUIDELINES", [
            ('neverCriticize', 'To Whom You Should Never Criticize or Judge'),
            ('importantBooks', 'Important Books to Read to Uplift Your Life'),
            ('giftsToGive', 'Gifts - To Give'),
            ('giftsToReceive', 'Gifts - To Receive')
        ])

        # BHRIGUNANDA NADI
        add_section("BHRIGUNANDA NADI", [
            ('saturnRelation', 'Saturn Relation'),
            ('saturnFollowing', 'Saturn is following'),
            ('professionalMindset', 'Professional Mindset'),
            ('venusRelation', 'Venus Relation'),
            ('venusFollowing', 'Venus is following'),
            ('financialMindset', 'Financial Mindset')
        ])

        # Add timestamp
        ws[f'A{row}'] = f"Generated on: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}"
        ws[f'A{row}'].font = ws[f'A{row}'].font.copy(italic=True)

        # Adjust column widths
        ws.column_dimensions['A'].width = 40
        ws.column_dimensions['B'].width = 60

        # Save workbook
        wb.save(filepath)
        return filepath
