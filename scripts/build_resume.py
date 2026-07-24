from pathlib import Path
from xml.sax.saxutils import escape

from docx import Document
from docx.enum.text import WD_TAB_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
DOCX_PATH = ROOT / "Sankula_Koteswara_Rao_Resume.docx"
PDF_PATH = ROOT / "assets" / "Sankula_Koteswara_Rao_Resume.pdf"


RESUME = {
    "name": "Sankula Koteswara Rao",
    "headline": "Python & Django Developer | Full-Stack Web Developer",
    "contact": (
        "Bapatla, Andhra Pradesh, India | +91 9182015717 | "
        "srkotesh23@gmail.com | linkedin.com/in/sankula-koteswararao | github.com/rkotesh | "
        "kotesh-portfolio-nine.vercel.app"
    ),
    "summary": (
        "Final-year B.Tech AI and ML student and Python/Django developer with hands-on experience in "
        "Flask, REST APIs, React, JavaScript, MERN stack, MongoDB, Streamlit, and responsive web apps. "
        "Completed a 6-month Flipkart Launchpad Python Development internship and built deployed projects "
        "across leave management, college websites, asset management, and portfolio platforms."
    ),
    "skills": [
        "Languages: Python, JavaScript, HTML5, CSS3, MySQL",
        "Backend: Django, Flask, REST APIs, Express.js, Node.js, MongoDB",
        "Frontend and Tools: React.js, Vite, Tailwind CSS, Streamlit, Git, GitHub, Vercel, Render",
    ],
    "experience": [
        
        {
            "title": "Python Development Intern",
            "company": "Flipkart Launchpad Student Internship Programme",
            "date": "Aug 2025 - Jan 2026",
            "location": "Remote",
            "bullets": [
                "Completed a 6-month Python Development internship organized by Corvyx and Flipkart.",
                "Applied Python programming, debugging, and software development practices in an e-commerce learning environment.",
            ],
        },
    ],
    "projects": [
        
        {
            "name": "Employee Leave Management System (ELMS)",
            "tech": "Python, Flask, REST APIs, HTML, CSS, JavaScript",
            "link": "github.com/rkotesh/elms | elms-3.onrender.com",
            "bullets": [
                "Built a full-stack leave management system with authentication, employee/manager workflows, and REST API-based leave tracking.",
            ],
        },
        {
            "name": "College Website",
            "tech": "Python, Django, TypeScript, Vite, Vercel",
            "link": "github.com/rkotesh/college_website | college-website-omega-flax.vercel.app",
            "bullets": [
                "Built college-focused web platforms for academic operations, student information, attendance, and administrative records.",
            ],
        },
        {
            "name": "Asset Management SPA",
            "tech": "React, Vite, Tailwind CSS, Express.js, MongoDB",
            "link": "github.com/rkotesh/asset-management-spa",
            "bullets": [
                "Built a single-page asset management application with modern frontend tooling and backend data management.",
            ],
        },
        {
            "name": "Personal Developer Portfolio",
            "tech": "HTML, CSS, JavaScript, Vercel",
            "link": "github.com/rkotesh/kotesh-portfolio | kotesh-portfolio-nine.vercel.app",
            "bullets": [
                "Built a responsive portfolio with project sections, certifications, contact workflow, and an interactive assistant.",
            ],
        },
    ],
    "education": [
        "B.Tech in Artificial Intelligence and Machine Learning, Chalapathi Institute of Engineering and Technology, 2023 - 2027 | CGPA: 8.03",
    ],
    "certifications": [
        "Flipkart Launchpad Internship Programme - Python Development, Jan 2026",
        "Freedom With AI Master Class - AI Tools and Prompt Engineering Workflows, Jun 2025",
    ],
    "achievements": [
        "Published 12 public GitHub repositories across Python, JavaScript, HTML/CSS, and TypeScript.",
        "Built and deployed live applications using Vercel, Render, and Streamlit.",
        "Maintained professional LinkedIn presence with 735 followers and 500+ connections.",
    ],
}


def set_run_font(run, name="Arial", size=10, bold=False, color="000000"):
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:ascii"), name)
    run._element.rPr.rFonts.set(qn("w:hAnsi"), name)
    run.font.size = Pt(size)
    run.bold = bold
    run.font.color.rgb = RGBColor.from_string(color)


def style_doc(doc):
    section = doc.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(0.42)
    section.bottom_margin = Inches(0.42)
    section.left_margin = Inches(0.55)
    section.right_margin = Inches(0.55)

    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Arial"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    normal.font.size = Pt(9)
    normal.paragraph_format.space_after = Pt(0)
    normal.paragraph_format.line_spacing = 1.0

    for style_name, size in [("Heading 1", 11), ("Heading 2", 10)]:
        style = styles[style_name]
        style.font.name = "Arial"
        style._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
        style._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = RGBColor(0, 0, 0)
        style.paragraph_format.space_before = Pt(5)
        style.paragraph_format.space_after = Pt(1)


def add_bottom_border(paragraph):
    p_pr = paragraph._p.get_or_add_pPr()
    p_bdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "6")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), "BFBFBF")
    p_bdr.append(bottom)
    p_pr.append(p_bdr)


def add_section(doc, title):
    p = doc.add_paragraph()
    p.style = doc.styles["Heading 1"]
    run = p.add_run(title)
    set_run_font(run, size=10, bold=True)
    add_bottom_border(p)


def add_bullet(doc, text):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.left_indent = Inches(0.22)
    p.paragraph_format.first_line_indent = Inches(-0.18)
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run(text)
    set_run_font(run, size=8.7)


def add_docx_line(doc, left, right="", bold_left=False, italic_left=False, size=9):
    p = doc.add_paragraph()
    p.paragraph_format.tab_stops.add_tab_stop(Inches(7.2), WD_TAB_ALIGNMENT.RIGHT)
    left_run = p.add_run(left)
    set_run_font(left_run, size=size, bold=bold_left)
    left_run.italic = italic_left
    if right:
        right_run = p.add_run(f"\t{right}")
        set_run_font(right_run, size=size)
    p.paragraph_format.space_after = Pt(0)
    return p


def add_docx():
    doc = Document()
    style_doc(doc)

    name = doc.add_paragraph()
    name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = name.add_run(RESUME["name"])
    set_run_font(run, size=20, bold=False)
    name.paragraph_format.space_after = Pt(0)

    headline = doc.add_paragraph()
    headline.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = headline.add_run(RESUME["headline"])
    set_run_font(run, size=9.5)
    headline.paragraph_format.space_after = Pt(0)

    contact = doc.add_paragraph()
    contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = contact.add_run(RESUME["contact"])
    set_run_font(run, size=8)
    contact.paragraph_format.space_after = Pt(4)

    add_section(doc, "Education")
    add_docx_line(
        doc,
        "Chalapathi Institute of Engineering and Technology",
        "2023 - 2027",
        bold_left=True,
        size=9,
    )
    add_docx_line(doc, "B.Tech in Artificial Intelligence and Machine Learning | CGPA: 8.03", "", italic_left=True, size=8.8)

    add_section(doc, "Experience")
    for role in RESUME["experience"]:
        add_docx_line(doc, role["title"], role["date"], bold_left=True, size=9)
        add_docx_line(doc, f"{role['company']} | {role['location']}", "", italic_left=True, size=8.8)
        for bullet in role["bullets"]:
            add_bullet(doc, bullet)

    add_section(doc, "Projects")
    for project in RESUME["projects"]:
        add_docx_line(doc, f"{project['name']} | {project['tech']}", project["link"], bold_left=True, size=8.8)
        for bullet in project["bullets"]:
            add_bullet(doc, bullet)

    add_section(doc, "Technical Skills")
    for item in RESUME["skills"]:
        add_docx_line(doc, item, "", size=8.8)

    add_section(doc, "Certifications")
    for item in RESUME["certifications"]:
        add_docx_line(doc, item, "", size=8.8)

    add_section(doc, "Achievements")
    for item in RESUME["achievements"]:
        add_bullet(doc, item)

    doc.save(DOCX_PATH)


def pdf_paragraph(text, style):
    return Paragraph(escape(text), style)


def pdf_markup(markup, style):
    return Paragraph(markup, style)


def add_pdf_section(story, styles, title):
    story.append(Spacer(1, 3.2))
    story.append(pdf_paragraph(title, styles["section"]))
    story.append(HRFlowable(width="100%", thickness=0.45, color=colors.black, spaceBefore=0, spaceAfter=1.8))


def add_pdf_bullet(story, styles, text):
    story.append(pdf_paragraph(f"- {text}", styles["bullet"]))


def add_pdf_row(story, left, right, styles, left_style="entry"):
    table = Table(
        [[pdf_paragraph(left, styles[left_style]), pdf_paragraph(right, styles["right"])]],
        colWidths=[5.15 * inch, 2.15 * inch],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.append(table)


def add_pdf():
    PDF_PATH.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=letter,
        rightMargin=0.46 * inch,
        leftMargin=0.46 * inch,
        topMargin=0.35 * inch,
        bottomMargin=0.35 * inch,
    )

    base = getSampleStyleSheet()
    styles = {
        "name": ParagraphStyle(
            "Name",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=22,
            alignment=1,
            spaceAfter=0.5,
        ),
        "headline": ParagraphStyle(
            "Headline",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.0,
            leading=10,
            alignment=1,
            spaceAfter=0.5,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=7.15,
            leading=8.2,
            alignment=1,
            spaceAfter=2,
        ),
        "body": ParagraphStyle("Body", parent=base["Normal"], fontName="Helvetica", fontSize=8.0, leading=8.8, spaceAfter=1),
        "section": ParagraphStyle(
            "Section",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.0,
            leading=9.4,
            spaceBefore=0,
            spaceAfter=0,
        ),
        "entry": ParagraphStyle("Entry", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=8.35, leading=9.0, spaceAfter=0),
        "subentry": ParagraphStyle("Subentry", parent=base["Normal"], fontName="Helvetica-Oblique", fontSize=8.1, leading=8.7, spaceAfter=0),
        "right": ParagraphStyle("Right", parent=base["Normal"], fontName="Helvetica", fontSize=7.7, leading=8.5, alignment=2, spaceAfter=0),
        "skill": ParagraphStyle("Skill", parent=base["Normal"], fontName="Helvetica", fontSize=8.0, leading=8.7, spaceAfter=0.4),
        "bullet": ParagraphStyle("Bullet", parent=base["Normal"], fontName="Helvetica", fontSize=7.75, leading=8.35, leftIndent=9, firstLineIndent=-5.5, spaceAfter=0.1),
    }

    story = [
        pdf_paragraph(RESUME["name"], styles["name"]),
        pdf_paragraph(RESUME["headline"], styles["headline"]),
        pdf_paragraph(RESUME["contact"], styles["contact"]),
    ]

    add_pdf_section(story, styles, "Education")
    add_pdf_row(
        story,
        "Chalapathi Institute of Engineering and Technology",
        "2023 - 2027",
        styles,
    )
    story.append(pdf_paragraph("B.Tech in Artificial Intelligence and Machine Learning | CGPA: 8.03", styles["subentry"]))

    add_pdf_section(story, styles, "Experience")
    for role in RESUME["experience"]:
        add_pdf_row(story, role["title"], role["date"], styles)
        story.append(pdf_paragraph(f"{role['company']} | {role['location']}", styles["subentry"]))
        for bullet in role["bullets"]:
            add_pdf_bullet(story, styles, bullet)

    add_pdf_section(story, styles, "Projects")
    for project in RESUME["projects"]:
        add_pdf_row(story, f"{project['name']} | {project['tech']}", project["link"], styles)
        for bullet in project["bullets"]:
            add_pdf_bullet(story, styles, bullet)

    add_pdf_section(story, styles, "Technical Skills")
    for item in RESUME["skills"]:
        story.append(pdf_paragraph(item, styles["skill"]))

    add_pdf_section(story, styles, "Certifications")
    for item in RESUME["certifications"]:
        story.append(pdf_paragraph(item, styles["skill"]))

    add_pdf_section(story, styles, "Achievements")
    for item in RESUME["achievements"]:
        add_pdf_bullet(story, styles, item)

    doc.build(story)


if __name__ == "__main__":
    add_docx()
    add_pdf()
    print(f"Wrote {DOCX_PATH}")
    print(f"Wrote {PDF_PATH}")
