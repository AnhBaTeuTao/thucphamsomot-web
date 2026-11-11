import docx
import shutil
import os
from docx.shared import Pt, RGBColor
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls, qn

def tag_document(target_file):
    print(f"Processing: {target_file}")
    doc = docx.Document(target_file)

    # 1. Update Heading styles so defaults match our design system
    s1 = doc.styles['Heading 1']
    s1.font.name = 'Times New Roman'
    s1.font.size = Pt(15)
    s1.font.bold = True
    s1.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    s2 = doc.styles['Heading 2']
    s2.font.name = 'Times New Roman'
    s2.font.size = Pt(14)
    s2.font.bold = True
    s2.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    s3 = doc.styles['Heading 3']
    s3.font.name = 'Times New Roman'
    s3.font.size = Pt(13.5)
    s3.font.bold = True
    s3.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    # Store exact text before tagging to guarantee zero text changes
    text_before = [p.text for p in doc.paragraphs]

    tagged_headings = []

    for i, p in enumerate(doc.paragraphs):
        txt = p.text.strip()
        if not txt:
            continue

        style_name = None
        lvl = None

        # Level 1 Headings (H1)
        if txt.startswith(('1. RÀ SOÁT', '2. TỔNG HỢP', '3. TỔNG HỢP', '4. QUY TRÌNH')):
            style_name = 'Heading 1'
            lvl = 0
        # Level 2 Headings (H2)
        elif any(txt.startswith(f'{x}.') for x in ['1.1', '1.2', '1.3', '2.1', '2.2', '2.3', '2.4', '2.5', '3.1', '3.2', '3.3', '4.1', '4.2']):
            style_name = 'Heading 2'
            lvl = 1
        # Level 3 Headings (H3)
        elif txt.startswith(('A. Tối ưu', 'B. Tối ưu', 'C. Tối ưu', 'A. Đồng bộ', 'B. Tách rời', 'Bảng phân tích & Đặc tả')):
            style_name = 'Heading 3'
            lvl = 2

        if style_name is not None and lvl is not None:
            # Apply heading style
            p.style = style_name

            # Add explicit outline level for Google Docs & Word outline recognition
            pPr = p._p.get_or_add_pPr()
            outlineLvl = pPr.find(qn('w:outlineLvl'))
            if outlineLvl is None:
                outline_elem = parse_xml(f'<w:outlineLvl {nsdecls("w")} w:val="{lvl}"/>')
                pPr.append(outline_elem)
            else:
                outlineLvl.set(qn('w:val'), str(lvl))

            tagged_headings.append((i, style_name, lvl, txt))

    # Backup original before saving
    backup_path = target_file + ".bak"
    shutil.copyfile(target_file, backup_path)
    print(f"Created backup: {backup_path}")

    # Save tagged file
    doc.save(target_file)

    # Verify that text is 100% untouched
    doc_verify = docx.Document(target_file)
    text_after = [p.text for p in doc_verify.paragraphs]

    assert text_before == text_after, "CRITICAL ERROR: Text content was modified!"
    print(f"SUCCESS: Tagged {len(tagged_headings)} headings in {target_file}.")
    print("VERIFICATION: Text content is 100% IDENTICAL (zero added/removed characters).")

    for idx, sname, lvl, txt in tagged_headings:
        print(f"  [P{idx:3d} | {sname} | Level {lvl}]: {txt[:70]}")

if __name__ == "__main__":
    for f in ['BAO_CAO_RA_SOAT_WEBSITE_TPS1.docx', 'BAO_CAO_RA_SOAT_TPS1.docx']:
        if os.path.exists(f):
            tag_document(f)

