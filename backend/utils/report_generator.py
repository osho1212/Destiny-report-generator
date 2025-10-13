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
        """
        planet = self.sanitize_input(form_data.get(f'{prefix}_planet', ''))
        source = self.sanitize_input(form_data.get(f'{prefix}_source', ''))
        nl = self.sanitize_input(form_data.get(f'{prefix}_nl', ''))
        nl_source = self.sanitize_input(form_data.get(f'{prefix}_nl_source', ''))
        additional_house = self.sanitize_input(form_data.get(f'{prefix}_additional_house', ''))
        sl = self.sanitize_input(form_data.get(f'{prefix}_sl', ''))
        sl_source = self.sanitize_input(form_data.get(f'{prefix}_sl_source', ''))

        parts = []

        # Planet(Source)
        if planet:
            if source:
                parts.append(f'{planet}({source})')
            else:
                parts.append(planet)

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
            spaceAfter=20,
            alignment=1,
            fontName='Times-Bold'
        )
        story.append(Paragraph("DESTINY REPORT", title_style))
        story.append(Spacer(1, 0.4*inch))

        # Section Title Style - orange color matching preview, Times New Roman
        section_style = ParagraphStyle(
            'SectionTitle',
            parent=styles['Heading2'],
            fontSize=18,
            textColor=colors.HexColor('#ff8c00'),
            spaceBefore=20,
            spaceAfter=12,
            fontName='Times-Bold'
        )

        # Field Style - Times New Roman
        field_style = ParagraphStyle(
            'FieldStyle',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=8,
            fontName='Times-Roman'
        )

        # Helper function to add section (only if it has content)
        def add_section(title, fields):
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
            story.append(Spacer(1, 0.1*inch))

            for field_key, field_label in fields:
                value = self.sanitize_input(form_data.get(field_key, ''))
                if value:
                    text = f"<b>{field_label}:</b> {value}"
                    story.append(Paragraph(text, field_style))
            story.append(Spacer(1, 0.2*inch))

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
            story.append(Spacer(1, 0.1*inch))

            # Add Mahadasha
            if mahadasha:
                story.append(Paragraph(f"<b>Mahadasha:</b> {mahadasha}", field_style))

            # Add Antardasha
            if antardasha:
                story.append(Paragraph(f"<b>Antardasha:</b> {antardasha}", field_style))

            # Add Pratyantardasha
            if pratyantardasha:
                story.append(Paragraph(f"<b>Pratyantar Dasha:</b> {pratyantardasha}", field_style))

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
                    story.append(Paragraph(f"<b>{field_label}:</b> {value}", field_style))

            story.append(Spacer(1, 0.2*inch))

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

            for field_key, field_label in fields:
                value = self.sanitize_input(form_data.get(field_key, ''))
                if value:
                    p = doc.add_paragraph()
                    # Bold label with Times New Roman
                    label_run = p.add_run(f'{field_label}: ')
                    label_run.bold = True
                    label_run.font.name = 'Times New Roman'
                    label_run.font.size = Pt(11)
                    # Value with Times New Roman
                    value_run = p.add_run(str(value))
                    value_run.font.name = 'Times New Roman'
                    value_run.font.size = Pt(11)
            doc.add_paragraph()

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

            # Add Mahadasha
            if mahadasha:
                p = doc.add_paragraph()
                label_run = p.add_run('Mahadasha: ')
                label_run.bold = True
                label_run.font.name = 'Times New Roman'
                label_run.font.size = Pt(11)
                value_run = p.add_run(mahadasha)
                value_run.font.name = 'Times New Roman'
                value_run.font.size = Pt(11)

            # Add Antardasha
            if antardasha:
                p = doc.add_paragraph()
                label_run = p.add_run('Antardasha: ')
                label_run.bold = True
                label_run.font.name = 'Times New Roman'
                label_run.font.size = Pt(11)
                value_run = p.add_run(antardasha)
                value_run.font.name = 'Times New Roman'
                value_run.font.size = Pt(11)

            # Add Pratyantardasha
            if pratyantardasha:
                p = doc.add_paragraph()
                label_run = p.add_run('Pratyantar Dasha: ')
                label_run.bold = True
                label_run.font.name = 'Times New Roman'
                label_run.font.size = Pt(11)
                value_run = p.add_run(pratyantardasha)
                value_run.font.name = 'Times New Roman'
                value_run.font.size = Pt(11)

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
                    p = doc.add_paragraph()
                    label_run = p.add_run(f'{field_label}: ')
                    label_run.bold = True
                    label_run.font.name = 'Times New Roman'
                    label_run.font.size = Pt(11)
                    value_run = p.add_run(str(value))
                    value_run.font.name = 'Times New Roman'
                    value_run.font.size = Pt(11)

            doc.add_paragraph()

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
