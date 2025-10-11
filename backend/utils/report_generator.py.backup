from docx import Document
from docx.shared import Inches, Pt
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from openpyxl import Workbook
from jinja2 import Template
from datetime import datetime
import os

class ReportGenerator:
    def __init__(self):
        self.output_dir = 'generated_reports'
        os.makedirs(self.output_dir, exist_ok=True)

    def format_dasha(self, form_data, prefix):
        """Format dasha data from form fields
        Format: Planet(Source), NL(NL Source), (Additional house), SL(SL source)
        """
        planet = form_data.get(f'{prefix}_planet', '')
        source = form_data.get(f'{prefix}_source', '')
        nl = form_data.get(f'{prefix}_nl', '')
        nl_source = form_data.get(f'{prefix}_nl_source', '')
        additional_house = form_data.get(f'{prefix}_additional_house', '')
        sl = form_data.get(f'{prefix}_sl', '')
        sl_source = form_data.get(f'{prefix}_sl_source', '')

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
            period_from = form_data.get(f'{prefix}_period_from', '')
            period_to = form_data.get(f'{prefix}_period_to', '')

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
        client_name = form_data.get('name', 'Client').replace(' ', '_')
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
            fontName='Helvetica-Bold'
        )
        story.append(Paragraph("DESTINY REPORT", title_style))
        story.append(Spacer(1, 0.4*inch))

        # Section Title Style
        section_style = ParagraphStyle(
            'SectionTitle',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#667eea'),
            spaceBefore=20,
            spaceAfter=12,
            fontName='Helvetica-Bold'
        )

        # Field Style
        field_style = ParagraphStyle(
            'FieldStyle',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=8
        )

        # Helper function to add section
        def add_section(title, fields):
            story.append(Paragraph(title, section_style))
            story.append(Spacer(1, 0.1*inch))
            for field_key, field_label in fields:
                value = form_data.get(field_key, '')
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
        story.append(Paragraph("ASTROLOGY", section_style))
        story.append(Spacer(1, 0.1*inch))

        # Add Mahadasha
        mahadasha = self.format_dasha(form_data, 'mahadasha')
        if mahadasha:
            story.append(Paragraph(f"<b>Mahadasha:</b> {mahadasha}", field_style))

        # Add Antardasha
        antardasha = self.format_dasha(form_data, 'antardasha')
        if antardasha:
            story.append(Paragraph(f"<b>Antardasha:</b> {antardasha}", field_style))

        # Add Pratyantardasha
        pratyantardasha = self.format_dasha(form_data, 'pratyantardasha')
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
            ('beneficialSymbols', 'Most Beneficial Symbols')
        ]:
            value = form_data.get(field_key, '')
            if value:
                story.append(Paragraph(f"<b>{field_label}:</b> {value}", field_style))

        story.append(Spacer(1, 0.2*inch))

        # ASTRO VASTU SOLUTION
        add_section("ASTRO VASTU SOLUTION", [
            ('astroVastuRemediesHouse', 'Astro Vastu Remedies for House'),
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
            ('professionalMindset', 'Professional Mindset'),
            ('financialMindset', 'Financial Mindset')
        ])

        # Add timestamp
        story.append(Spacer(1, 0.3*inch))
        timestamp_text = f"Generated on: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}"
        story.append(Paragraph(timestamp_text, styles['Italic']))

        # Build PDF
        doc.build(story)
        return filepath

    def generate_docx(self, form_data):
        """Generate Word Destiny Report from form data"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        client_name = form_data.get('name', 'Client').replace(' ', '_')
        filename = f'destiny_report_{client_name}_{timestamp}.docx'
        filepath = os.path.join(self.output_dir, filename)

        # Create document
        doc = Document()

        # Add main title
        title = doc.add_heading('DESTINY REPORT', 0)
        title.alignment = 1  # Center
        doc.add_paragraph()

        # Helper function to add section
        def add_section(title, fields):
            doc.add_heading(title, level=1)
            for field_key, field_label in fields:
                value = form_data.get(field_key, '')
                if value:
                    p = doc.add_paragraph()
                    p.add_run(f'{field_label}: ').bold = True
                    p.add_run(str(value))
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
        story.append(Paragraph("ASTROLOGY", section_style))
        story.append(Spacer(1, 0.1*inch))

        # Add Mahadasha
        mahadasha = self.format_dasha(form_data, 'mahadasha')
        if mahadasha:
            story.append(Paragraph(f"<b>Mahadasha:</b> {mahadasha}", field_style))

        # Add Antardasha
        antardasha = self.format_dasha(form_data, 'antardasha')
        if antardasha:
            story.append(Paragraph(f"<b>Antardasha:</b> {antardasha}", field_style))

        # Add Pratyantardasha
        pratyantardasha = self.format_dasha(form_data, 'pratyantardasha')
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
            ('beneficialSymbols', 'Most Beneficial Symbols')
        ]:
            value = form_data.get(field_key, '')
            if value:
                story.append(Paragraph(f"<b>{field_label}:</b> {value}", field_style))

        story.append(Spacer(1, 0.2*inch))

        # ASTRO VASTU SOLUTION
        add_section("ASTRO VASTU SOLUTION", [
            ('astroVastuRemediesHouse', 'Astro Vastu Remedies for House'),
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
            ('professionalMindset', 'Professional Mindset'),
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
        client_name = form_data.get('name', 'Client').replace(' ', '_')
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
            ws[f'A{row}'].font = ws[f'A{row}'].font.copy(size=14, bold=True, color='667EEA')
            ws.merge_cells(f'A{row}:B{row}')
            row += 1

            # Section fields
            for field_key, field_label in fields:
                value = form_data.get(field_key, '')
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

        # ASTROLOGY (Custom handling for Dashas)
        story.append(Paragraph("ASTROLOGY", section_style))
        story.append(Spacer(1, 0.1*inch))

        # Add Mahadasha
        mahadasha = self.format_dasha(form_data, 'mahadasha')
        if mahadasha:
            story.append(Paragraph(f"<b>Mahadasha:</b> {mahadasha}", field_style))

        # Add Antardasha
        antardasha = self.format_dasha(form_data, 'antardasha')
        if antardasha:
            story.append(Paragraph(f"<b>Antardasha:</b> {antardasha}", field_style))

        # Add Pratyantardasha
        pratyantardasha = self.format_dasha(form_data, 'pratyantardasha')
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
            ('beneficialSymbols', 'Most Beneficial Symbols')
        ]:
            value = form_data.get(field_key, '')
            if value:
                story.append(Paragraph(f"<b>{field_label}:</b> {value}", field_style))

        story.append(Spacer(1, 0.2*inch))

        # ASTRO VASTU SOLUTION
        add_section("ASTRO VASTU SOLUTION", [
            ('astroVastuRemediesHouse', 'Astro Vastu Remedies for House'),
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
            ('professionalMindset', 'Professional Mindset'),
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
