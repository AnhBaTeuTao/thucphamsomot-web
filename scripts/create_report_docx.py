import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
from PIL import Image

def ensure_png(src_path, dest_path):
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    if os.path.exists(src_path):
        im = Image.open(src_path)
        im.save(dest_path, "PNG")
        return dest_path
    return None

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=120, right=120):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="D1D5DB", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def build_full_report():
    doc = Document()

    # Setup Section & Margins (0.8 inches ~ 2cm)
    section = doc.sections[0]
    section.top_margin = Inches(0.8)
    section.bottom_margin = Inches(0.8)
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.8)
    section.header_distance = Inches(0.35)
    section.footer_distance = Inches(0.35)

    # Setup Running Header
    header = section.header
    t_head = header.add_table(rows=1, cols=2, width=Inches(6.8))
    t_head.alignment = WD_TABLE_ALIGNMENT.CENTER

    cell_hl = t_head.rows[0].cells[0]
    cell_hr = t_head.rows[0].cells[1]
    cell_hl.width = Inches(3.6)
    cell_hr.width = Inches(3.2)

    p_hl = cell_hl.paragraphs[0]
    p_hl.paragraph_format.space_before = Pt(0)
    p_hl.paragraph_format.space_after = Pt(2)
    r_hl = p_hl.add_run("THỰC PHẨM SỐ MỘT (TPS1)")
    r_hl.font.name = "Times New Roman"
    r_hl.font.size = Pt(9)
    r_hl.font.bold = True
    r_hl.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    p_hr = cell_hr.paragraphs[0]
    p_hr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_hr.paragraph_format.space_before = Pt(0)
    p_hr.paragraph_format.space_after = Pt(2)
    r_hr = p_hr.add_run("Báo cáo Kỹ thuật & Hồ sơ Đặc tả Giao diện Hệ thống")
    r_hr.font.name = "Times New Roman"
    r_hr.font.size = Pt(8.5)
    r_hr.font.italic = True
    r_hr.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

    # Header bottom green border
    tblPr_h = t_head._tbl.tblPr
    bdr_h = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="none"/>'
        f'<w:left w:val="none"/>'
        f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="0F6F4B"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="none"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr_h.append(bdr_h)

    # Setup Running Footer
    footer = section.footer
    t_foot = footer.add_table(rows=1, cols=2, width=Inches(6.8))
    t_foot.alignment = WD_TABLE_ALIGNMENT.CENTER

    cell_fl = t_foot.rows[0].cells[0]
    cell_fr = t_foot.rows[0].cells[1]
    cell_fl.width = Inches(4.6)
    cell_fr.width = Inches(2.2)

    p_fl = cell_fl.paragraphs[0]
    p_fl.paragraph_format.space_before = Pt(2)
    p_fl.paragraph_format.space_after = Pt(0)
    r_fl = p_fl.add_run("thucphamsomot.vn   |   Tài liệu kỹ thuật lưu hành nội bộ")
    r_fl.font.name = "Times New Roman"
    r_fl.font.size = Pt(8.5)
    r_fl.font.italic = True
    r_fl.font.color.rgb = RGBColor(0x9C, 0xA3, 0xAF)

    p_fr = cell_fr.paragraphs[0]
    p_fr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_fr.paragraph_format.space_before = Pt(2)
    p_fr.paragraph_format.space_after = Pt(0)
    r_fr = p_fr.add_run("Trang ")
    r_fr.font.name = "Times New Roman"
    r_fr.font.size = Pt(8.5)
    r_fr.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

    fld_pg = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>')
    p_fr._p.append(fld_pg)

    r_fr_s = p_fr.add_run(" / ")
    r_fr_s.font.name = "Times New Roman"
    r_fr_s.font.size = Pt(8.5)
    r_fr_s.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

    fld_npg = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="NUMPAGES"/>')
    p_fr._p.append(fld_npg)

    tblPr_f = t_foot._tbl.tblPr
    bdr_f = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/>'
        f'<w:left w:val="none"/>'
        f'<w:bottom w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="none"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr_f.append(bdr_f)

    # Base Normal Style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12.5)
    normal_style.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    # Document Header Badge
    h_p = doc.add_paragraph()
    h_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    h_p.paragraph_format.space_before = Pt(0)
    h_p.paragraph_format.space_after = Pt(4)
    run_company = h_p.add_run("CÔNG TY TNHH THỰC PHẨM SỐ MỘT (TPS1)\n")
    run_company.font.name = 'Times New Roman'
    run_company.font.size = Pt(13)
    run_company.font.bold = True
    run_company.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    run_title = h_p.add_run("BÁO CÁO KỸ THUẬT VÀ HỒ SƠ ĐẶC TẢ GIAO DIỆN HỆ THỐNG\n")
    run_title.font.name = 'Times New Roman'
    run_title.font.size = Pt(18)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    run_sub = h_p.add_run("TỔNG HỢP RÀ SOÁT, TỐI ƯU HÓA UI/UX VÀ QUY CHUẨN THỰC THI TOÀN TRANG WEBSITE TPS1\n")
    run_sub.font.name = 'Times New Roman'
    run_sub.font.size = Pt(12.5)
    run_sub.font.bold = True
    run_sub.font.color.rgb = RGBColor(0x05, 0x96, 0x69)

    run_meta = h_p.add_run("Ngày cập nhật: 10/11/2026   |   Phạm vi: Toàn bộ Hệ thống Website TPS1   |   Trạng thái: Hoàn tất 100%")
    run_meta.font.name = 'Times New Roman'
    run_meta.font.size = Pt(10.5)
    run_meta.font.italic = True
    run_meta.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

    # Divider bar
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_before = Pt(4)
    p_div.paragraph_format.space_after = Pt(16)
    p_div_border = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="14" w:space="1" w:color="0F6F4B"/></w:pBdr>')
    p_div._p.get_or_add_pPr().append(p_div_border)

    # ==================== PHẦN 1: RÀ SOÁT LỖI NÚT BẤM & BẢNG CHỈ MỤC KIẾN TRÚC ====================
    p_s1 = doc.add_paragraph()
    p_s1.paragraph_format.space_before = Pt(10)
    p_s1.paragraph_format.space_after = Pt(6)
    r_s1 = p_s1.add_run("1. RÀ SOÁT, PHÁT HIỆN VÀ KHẮC PHỤC LỖI NÚT BẤM (BUTTON) & LIÊN KẾT (LINK)")
    r_s1.font.name = 'Times New Roman'
    r_s1.font.size = Pt(15)
    r_s1.font.bold = True
    r_s1.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    p_s11 = doc.add_paragraph()
    p_s11.paragraph_format.space_before = Pt(4)
    p_s11.paragraph_format.space_after = Pt(4)
    r_s11 = p_s11.add_run("1.1. Tóm tắt điều hành (Executive Summary)")
    r_s11.font.name = 'Times New Roman'
    r_s11.font.size = Pt(14)
    r_s11.font.bold = True
    r_s11.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    p_s11_body = doc.add_paragraph()
    p_s11_body.paragraph_format.line_spacing = 1.2
    p_s11_body.paragraph_format.space_after = Pt(8)
    p_s11_body.add_run(
        "Hệ thống website thucphamsomot.vn gồm 228 file nguồn và hơn 340 điểm tương tác (<button>, <Link>, <a>) "
        "đã được rà soát và kiểm thử tự động toàn diện. Tổng cộng 8 điểm nghẽn/lỗi liên kết và nút bấm đã được xử lý triệt để (100%). "
        "Toàn bộ các nút kêu gọi hành động báo giá đã được thống nhất nhãn 'Gửi yêu cầu báo giá' và trỏ trực tiếp về "
        "Cổng Báo Giá Doanh Nghiệp (/bao-gia và /en/bao-gia). Kết quả kiểm thử tự động 186/186 routes đạt chuẩn HTTP 200 OK."
    )

    # 1.2 Bảng chỉ mục kiến trúc tệp nguồn & Quy tắc bất biến hệ thống
    p_s12_idx = doc.add_paragraph()
    p_s12_idx.paragraph_format.space_before = Pt(6)
    p_s12_idx.paragraph_format.space_after = Pt(4)
    r_s12_idx = p_s12_idx.add_run("1.2. Bảng chỉ mục tệp nguồn & Quy chuẩn kiến trúc toàn hệ thống (Master Architecture Map):")
    r_s12_idx.font.name = 'Times New Roman'
    r_s12_idx.font.size = Pt(14)
    r_s12_idx.font.bold = True
    r_s12_idx.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    t_map = doc.add_table(rows=7, cols=4)
    t_map.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_map.autofit = False
    set_table_borders(t_map, color="D1D5DB", sz="4", val="single")

    map_widths = [Inches(1.5), Inches(1.2), Inches(2.2), Inches(2.0)]
    map_headers = ["Trang / Phân hệ", "Đường dẫn URL", "Tệp nguồn phụ trách (File path)", "Vai trò & Quy chuẩn kiến trúc cốt lõi"]

    for i, title in enumerate(map_headers):
        t_map.rows[0].cells[i].width = map_widths[i]
        set_cell_background(t_map.rows[0].cells[i], "0F6F4B")
        set_cell_margins(t_map.rows[0].cells[i], top=90, bottom=90, left=100, right=100)
        p = t_map.rows[0].cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    map_data = [
        ("Trang Chủ (Homepage)", "/", "app/page.tsx\ncomponents/b2b/*", "Bộ mặt thương hiệu: 6 thẻ cam kết lưới 3 cột, Bento Grid tương phản cao, nút CTA dẫn về /bao-gia."),
        ("Danh Mục Hàng Hóa", "/san-pham", "app/san-pham/page.tsx\napp/san-pham/products-grid.tsx", "Catalog sản phẩm B2B: Proof Card tỷ lệ 0.95fr, ngắt dòng chữ 'thực phẩm', anchor cuộn id='danh-muc'."),
        ("Ngành Hàng (Hub)", "/nganh-hang", "app/nganh-hang/page.tsx\napp/nganh-hang/[slug]/page.tsx", "Giải pháp 5 mô hình bếp: Giữ nguyên tuyệt đối danh từ 'Ngành Hàng', Flexbox ghim thẳng hàng tag dịch vụ."),
        ("Quy Trình Giao Nhận", "/quy-trinh", "app/quy-trinh/page.tsx\napp/globals.css (.b2b-timeline)", "6 bước vận hành ISO 22000: Banner Hero blend multiply giống Giới Thiệu, icon nằm giữa chấm ray .b2b-timeline__dot."),
        ("Trang Liên Hệ & Tư Vấn", "/lien-he", "app/lien-he/page.tsx\ncomponents/lead-form.tsx", "Kênh kết nối & tư vấn: H1 'Liên hệ tư vấn', form mode='contact', quy trình 4 bước tiếp nhận đối tác."),
        ("Cổng Báo Giá Doanh Nghiệp", "/bao-gia\n/en/bao-gia", "app/bao-gia/page.tsx\ncomponents/quote-portal.tsx", "Phễu chuyển đổi chính: Báo giá sỉ theo danh sách, xác nhận trong 30 phút và hoàn tất báo giá trong 24 giờ.")
    ]

    for row_idx, row_data in enumerate(map_data, start=1):
        row_cells = t_map.rows[row_idx].cells
        bg_col = "F9FAFB" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            row_cells[col_idx].width = map_widths[col_idx]
            set_cell_background(row_cells[col_idx], bg_col)
            set_cell_margins(row_cells[col_idx], top=70, bottom=70, left=90, right=90)
            p = row_cells[col_idx].paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    # 1.3 Bảng 8 lỗi Button
    p_s12 = doc.add_paragraph()
    p_s12.paragraph_format.space_before = Pt(10)
    p_s12.paragraph_format.space_after = Pt(4)
    r_s12 = p_s12.add_run("1.3. Bảng tổng hợp chi tiết 8 lỗi Button/Link đã phát hiện và xử lý:")
    r_s12.font.name = 'Times New Roman'
    r_s12.font.size = Pt(14)
    r_s12.font.bold = True
    r_s12.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    t1 = doc.add_table(rows=9, cols=5)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    t1.autofit = False
    set_table_borders(t1, color="D1D5DB", sz="4", val="single")

    t1_widths = [Inches(0.4), Inches(1.5), Inches(1.5), Inches(1.7), Inches(1.8)]
    t1_headers = ["STT", "Vị Trí / Tệp Tin", "Tên Nút Bấm", "Hiện Trạng Lỗi", "Cách Đã Xử Lý"]

    for i, title in enumerate(t1_headers):
        t1.rows[0].cells[i].width = t1_widths[i]
        set_cell_background(t1.rows[0].cells[i], "0F6F4B")
        set_cell_margins(t1.rows[0].cells[i], top=90, bottom=90, left=100, right=100)
        p = t1.rows[0].cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    t1_data = [
        ("1", "Trang Chủ\n(app/page.tsx)", "Gửi yêu cầu báo giá ->\n(CTA Sẵn sàng hợp tác)", "NÚT CHẾT: Trỏ vào #rfq-form không tồn tại trên trang chủ. Bấm không phản hồi.", "Chuyển href sang '/bao-gia' (đưa khách vào Cổng Báo giá B2B). Bổ sung id='rfq-form' dự phòng tại Hero."),
        ("2", "Trang Chủ EN\n(app/en/page.tsx)", "Send quote request ->\n(Ready to partner)", "TRỎ SAI VỊ TRÍ: Trỏ vào #rfq-form khiến trang bị giật ngược lên form phía trên thay vì mở trang báo giá tiếng Anh.", "Chuyển href sang '/en/bao-gia' đưa khách quốc tế/FDI đến trang báo giá chuẩn tiếng Anh."),
        ("3", "Trang Sản Phẩm\n(app/san-pham/page.tsx)", "Khám phá danh mục ->\n(Hero banner sản phẩm)", "NÚT CHẾT: Trỏ vào href='#danh-muc' nhưng thẻ danh mục bên dưới thiếu id='danh-muc'. Bấm không cuộn.", "Bổ sung thuộc tính id='danh-muc' vào thẻ <nav className='sku-group-links'>. Bấm vào cuộn mượt xuống danh mục."),
        ("4", "Biểu mẫu nhanh\n(quick-quote-form.tsx)", "Gửi thêm file tại đây\n(Màn hình sau khi gửi form)", "NÚT CHẾT TIỀM ẨN: Sau khi điền form nhanh, link phụ trỏ vào #rfq-form không hoạt động ở trang chủ.", "Chuyển liên kết sang Cổng Báo giá đầy đủ: href='/bao-gia'. Khách có thể đính kèm file Excel dự toán dễ dàng."),
        ("5", "Trang Giới Thiệu\n(app/gioi-thieu/page.tsx)", "Gửi yêu cầu báo giá\n(Dải CTA chân trang)", "TRỎ SAI MỤC TIÊU: Khách cần nhận báo giá sỉ nhưng nút lại trỏ sang trang Liên hệ (/lien-he).", "Đã chuẩn hóa chuyển hướng sang Cổng Báo giá chính thức: href='/bao-gia'."),
        ("6", "Trang Chủ (CTA)\n(app/page.tsx & en/page.tsx)", "Tải hồ sơ năng lực\n(Download company profile)", "TRỎ SAI MỤC TIÊU: Nút 'Tải hồ sơ năng lực' trỏ về trang '/gioi-thieu' không có chức năng tải PDF.", "Chuyển liên kết chuẩn hóa về trang xem và tải PDF chuyên dụng: href='/ho-so-nang-luc'."),
        ("7", "Biểu mẫu liên hệ\n(lead-form.tsx, dòng 83)", "Gửi yêu cầu báo giá /\nGửi liên hệ", "THIẾU TYPE SUBMIT: Thẻ <button> thiếu thuộc tính type='submit' tường minh, có thể bị lỗi trên trình duyệt cũ.", "Bổ sung tường minh type='submit' disabled={isSubmitting} chuẩn W3C và hỗ trợ Accessibility."),
        ("8", "Chi tiết báo giá\n(view/[id]/page.tsx)", "In báo giá / Tải PDF\n(Trang xem báo giá)", "LỖI REACT SERVER COMPONENT: Nút in chứa onClick=window.print() đặt trong Server Component gây cảnh báo.", "Tách riêng Client Component PrintQuoteButton chuyên trách xử lý window.print() mượt mà.")
    ]

    for row_idx, row_data in enumerate(t1_data, start=1):
        row_cells = t1.rows[row_idx].cells
        bg_col = "F9FAFB" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            row_cells[col_idx].width = t1_widths[col_idx]
            set_cell_background(row_cells[col_idx], bg_col)
            set_cell_margins(row_cells[col_idx], top=70, bottom=70, left=90, right=90)
            p = row_cells[col_idx].paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            if col_idx == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    # ==================== PHẦN 2: TỔNG HỢP CÁC HẠNG MỤC ĐIỀU CHỈNH GIAO DIỆN (UI/UX) ====================
    doc.add_page_break()

    p_s2 = doc.add_paragraph()
    p_s2.paragraph_format.space_before = Pt(12)
    p_s2.paragraph_format.space_after = Pt(6)
    r_s2 = p_s2.add_run("2. TỔNG HỢP CÁC HẠNG MỤC ĐIỀU CHỈNH & ĐẶC TẢ KỸ THUẬT GIAO DIỆN (UI/UX)")
    r_s2.font.name = 'Times New Roman'
    r_s2.font.size = Pt(15)
    r_s2.font.bold = True
    r_s2.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    # 5-column widths for technical tables: Total = 1.3 + 1.3 + 1.6 + 1.4 + 1.3 = 6.9 inches
    spec_col_widths = [Inches(1.3), Inches(1.3), Inches(1.6), Inches(1.4), Inches(1.3)]
    spec_col_headers = ["Thành phần & Tệp nguồn", "Hiện trạng lỗi trước sửa", "Đặc tả kỹ thuật chuẩn hóa", "Quy tắc bất biến (Cấm vi phạm)", "Tiêu chí nghiệm thu"]

    # ==================== 2.1 TRANG CHỦ ====================
    p_s21 = doc.add_paragraph()
    p_s21.paragraph_format.space_before = Pt(8)
    p_s21.paragraph_format.space_after = Pt(6)
    r_s21 = p_s21.add_run("2.1. Điều chỉnh giao diện ở Trang chủ (Homepage — app/page.tsx)")
    r_s21.font.name = 'Times New Roman'
    r_s21.font.size = Pt(14)
    r_s21.font.bold = True
    r_s21.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    p_s21_intro = doc.add_paragraph()
    p_s21_intro.paragraph_format.line_spacing = 1.2
    p_s21_intro.paragraph_format.space_after = Pt(10)
    p_s21_intro.add_run(
        "Trang chủ đóng vai trò hạt nhân trong việc định vị uy tín thương hiệu B2B của Thực Phẩm Số Một (TPS1). "
        "Dưới đây là hình ảnh thực tế đối sánh trước — sau và bảng đặc tả kỹ thuật chi tiết theo chuẩn công nghệ phần mềm."
    )

    # Cụm A
    p_g1_head = doc.add_paragraph()
    p_g1_head.paragraph_format.space_before = Pt(6)
    p_g1_head.paragraph_format.space_after = Pt(4)
    r_g1_head = p_g1_head.add_run("A. Tối ưu bố cục Khối Cam kết dịch vụ ('Vì sao nhiều gian bếp chọn TPS1?') & Nút Header:")
    r_g1_head.font.name = 'Times New Roman'
    r_g1_head.font.size = Pt(13.5)
    r_g1_head.font.bold = True
    r_g1_head.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    p_c1 = doc.add_paragraph()
    p_c1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c1.paragraph_format.space_before = Pt(10)
    p_c1.paragraph_format.space_after = Pt(4)
    r_c1 = p_c1.add_run("Bản hiện tại")
    r_c1.font.name = 'Times New Roman'
    r_c1.font.size = Pt(12.5)
    r_c1.font.bold = True

    img_b1_png = "docs/report_images/home_pillars_before.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794288391530_6fa4e228.jpg", img_b1_png)
    if os.path.exists(img_b1_png):
        p_img_b1 = doc.add_paragraph()
        p_img_b1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_b1.paragraph_format.space_after = Pt(4)
        p_img_b1.add_run().add_picture(img_b1_png, width=Inches(6.4))

    p_cap_b1 = doc.add_paragraph()
    p_cap_b1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_b1.paragraph_format.space_after = Pt(12)
    r_cap_b1 = p_cap_b1.add_run("Hình 2.1a: Giao diện ban đầu — Lưới chia 4 cột khiến hàng trên 4 ô, hàng dưới chỉ có 2 ô bị cụt lệch sang trái; nút Header mang nhãn 'Yêu Cầu Báo Giá'.")
    r_cap_b1.font.name = 'Times New Roman'
    r_cap_b1.font.size = Pt(10.5)
    r_cap_b1.font.italic = True
    r_cap_b1.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

    p_a1 = doc.add_paragraph()
    p_a1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_a1.paragraph_format.space_before = Pt(8)
    p_a1.paragraph_format.space_after = Pt(4)
    r_a1 = p_a1.add_run("Bản chỉnh sửa")
    r_a1.font.name = 'Times New Roman'
    r_a1.font.size = Pt(12.5)
    r_a1.font.bold = True
    r_a1.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    img_a1_png = "docs/report_images/home_pillars_after.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794288415351_84868fb1.jpg", img_a1_png)
    if os.path.exists(img_a1_png):
        p_img_a1 = doc.add_paragraph()
        p_img_a1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_a1.paragraph_format.space_after = Pt(4)
        p_img_a1.add_run().add_picture(img_a1_png, width=Inches(6.4))

    p_cap_a1 = doc.add_paragraph()
    p_cap_a1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_a1.paragraph_format.space_after = Pt(16)
    r_cap_a1 = p_cap_a1.add_run("Hình 2.1b: Giao diện sau tối ưu — Lưới 3 cột chia đều đặn 6 ô thành 2 hàng cân xứng tuyệt đối (3 trên, 3 dưới); nút Header đồng bộ chuẩn 'Gửi yêu cầu báo giá'.")
    r_cap_a1.font.name = 'Times New Roman'
    r_cap_a1.font.size = Pt(10.5)
    r_cap_a1.font.italic = True
    r_cap_a1.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    # Cụm B
    p_g2_head = doc.add_paragraph()
    p_g2_head.paragraph_format.space_before = Pt(8)
    p_g2_head.paragraph_format.space_after = Pt(4)
    r_g2_head = p_g2_head.add_run("B. Tối ưu trục tim Khối Quy trình 3 bước & CTA chân trang chủ:")
    r_g2_head.font.name = 'Times New Roman'
    r_g2_head.font.size = Pt(13.5)
    r_g2_head.font.bold = True
    r_g2_head.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    p_c2 = doc.add_paragraph()
    p_c2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c2.paragraph_format.space_before = Pt(8)
    p_c2.paragraph_format.space_after = Pt(4)
    r_c2 = p_c2.add_run("Bản hiện tại")
    r_c2.font.name = 'Times New Roman'
    r_c2.font.size = Pt(12.5)
    r_c2.font.bold = True

    img_b2_png = "docs/report_images/home_process_before.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794288825598_fae9b470.jpg", img_b2_png)
    if os.path.exists(img_b2_png):
        p_img_b2 = doc.add_paragraph()
        p_img_b2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_b2.paragraph_format.space_after = Pt(4)
        p_img_b2.add_run().add_picture(img_b2_png, width=Inches(6.4))

    p_cap_b2 = doc.add_paragraph()
    p_cap_b2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_b2.paragraph_format.space_after = Pt(12)
    r_cap_b2 = p_cap_b2.add_run("Hình 2.1c: Giao diện ban đầu — Đường kết nối bước lệch tim so với vòng tròn số; nút Header mang nhãn 'Yêu Cầu Báo Giá'.")
    r_cap_b2.font.name = 'Times New Roman'
    r_cap_b2.font.size = Pt(10.5)
    r_cap_b2.font.italic = True
    r_cap_b2.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

    p_a2 = doc.add_paragraph()
    p_a2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_a2.paragraph_format.space_before = Pt(8)
    p_a2.paragraph_format.space_after = Pt(4)
    r_a2 = p_a2.add_run("Bản chỉnh sửa")
    r_a2.font.name = 'Times New Roman'
    r_a2.font.size = Pt(12.5)
    r_a2.font.bold = True
    r_a2.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    img_a2_png = "docs/report_images/home_process_after.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794288871249_7bf9a3b6.jpg", img_a2_png)
    if os.path.exists(img_a2_png):
        p_img_a2 = doc.add_paragraph()
        p_img_a2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_a2.paragraph_format.space_after = Pt(4)
        p_img_a2.add_run().add_picture(img_a2_png, width=Inches(6.4))

    p_cap_a2 = doc.add_paragraph()
    p_cap_a2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_a2.paragraph_format.space_after = Pt(16)
    r_cap_a2 = p_cap_a2.add_run("Hình 2.1d: Giao diện sau tối ưu — Đường connector line chạy xuyên đúng tâm trục số 01, 02, 03; nút Header chuẩn hóa thành 'Gửi yêu cầu báo giá'.")
    r_cap_a2.font.name = 'Times New Roman'
    r_cap_a2.font.size = Pt(10.5)
    r_cap_a2.font.italic = True
    r_cap_a2.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    # Cụm C: Bento Grid
    p_g3_head = doc.add_paragraph()
    p_g3_head.paragraph_format.space_before = Pt(8)
    p_g3_head.paragraph_format.space_after = Pt(4)
    r_g3_head = p_g3_head.add_run("C. Tối ưu độ tương phản chữ và lớp phủ nền khối Danh mục sản phẩm (Bento Grid):")
    r_g3_head.font.name = 'Times New Roman'
    r_g3_head.font.size = Pt(13.5)
    r_g3_head.font.bold = True
    r_g3_head.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    p_c3 = doc.add_paragraph()
    p_c3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c3.paragraph_format.space_before = Pt(8)
    p_c3.paragraph_format.space_after = Pt(4)
    r_c3 = p_c3.add_run("Bản hiện tại")
    r_c3.font.name = 'Times New Roman'
    r_c3.font.size = Pt(12.5)
    r_c3.font.bold = True

    img_b3_png = "docs/report_images/home_bento_before.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794291070872_6cc8b501.jpg", img_b3_png)
    if os.path.exists(img_b3_png):
        p_img_b3 = doc.add_paragraph()
        p_img_b3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_b3.paragraph_format.space_after = Pt(4)
        p_img_b3.add_run().add_picture(img_b3_png, width=Inches(6.4))

    p_cap_b3 = doc.add_paragraph()
    p_cap_b3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_b3.paragraph_format.space_after = Pt(12)
    r_cap_b3 = p_cap_b3.add_run("Hình 2.1e: Giao diện ban đầu khối Danh mục sản phẩm (Bento Grid) — Tiêu đề và nội dung màu trắng đè lên nền ảnh nông sản quá sáng khiến chữ bị chìm, tạo cảm giác 'chữ trong suốt', mờ nhạt và khó đọc.")
    r_cap_b3.font.name = 'Times New Roman'
    r_cap_b3.font.size = Pt(10.5)
    r_cap_b3.font.italic = True
    r_cap_b3.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

    p_a3 = doc.add_paragraph()
    p_a3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_a3.paragraph_format.space_before = Pt(8)
    p_a3.paragraph_format.space_after = Pt(4)
    r_a3 = p_a3.add_run("Bản chỉnh sửa")
    r_a3.font.name = 'Times New Roman'
    r_a3.font.size = Pt(12.5)
    r_a3.font.bold = True
    r_a3.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    img_a3_png = "docs/report_images/home_bento_after.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794291083809_9f610f12.jpg", img_a3_png)
    if os.path.exists(img_a3_png):
        p_img_a3 = doc.add_paragraph()
        p_img_a3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_a3.paragraph_format.space_after = Pt(4)
        p_img_a3.add_run().add_picture(img_a3_png, width=Inches(6.4))

    p_cap_a3 = doc.add_paragraph()
    p_cap_a3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_a3.paragraph_format.space_after = Pt(16)
    r_cap_a3 = p_cap_a3.add_run("Hình 2.1f: Giao diện sau tối ưu — Bổ sung lớp phủ chuyển sắc (gradient overlay) đa tầng tối màu phía sau chữ kết hợp text-shadow và huy hiệu kính mờ (frosted glass), đảm bảo độ tương phản vượt bậc, chữ trắng sắc nét tuyệt đối trên mọi màn hình.")
    r_cap_a3.font.name = 'Times New Roman'
    r_cap_a3.font.size = Pt(10.5)
    r_cap_a3.font.italic = True
    r_cap_a3.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    # Bảng đặc tả kỹ thuật Trang chủ (5 CỘT)
    p_t2_head = doc.add_paragraph()
    p_t2_head.paragraph_format.space_before = Pt(8)
    p_t2_head.paragraph_format.space_after = Pt(4)
    r_t2_head = p_t2_head.add_run("Bảng phân tích & Đặc tả kỹ thuật các cấu phần đã tối ưu tại Trang chủ:")
    r_t2_head.font.name = 'Times New Roman'
    r_t2_head.font.size = Pt(13.5)
    r_t2_head.font.bold = True
    r_t2_head.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    t2 = doc.add_table(rows=6, cols=5)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    t2.autofit = False
    set_table_borders(t2, color="D1D5DB", sz="4", val="single")

    for i, title in enumerate(spec_col_headers):
        t2.rows[0].cells[i].width = spec_col_widths[i]
        set_cell_background(t2.rows[0].cells[i], "0F6F4B")
        set_cell_margins(t2.rows[0].cells[i], top=90, bottom=90, left=100, right=100)
        p = t2.rows[0].cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    t2_data = [
        ("Khối Cam kết dịch vụ\ncomponents/b2b/\ntrust-pillars.tsx\n(mảng TRUST_PILLARS)",
         "Mảng 6 cam kết nhưng chia lưới 4 cột, khiến hàng trên 4 ô, hàng dưới chỉ có 2 ô lẻ bị lệch về trái và hổng khoảng lớn bên phải.",
         "Cấu trúc CSS Grid chuẩn:\ngrid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 (repeat(3, 1fr) trên Desktop >= 1024px).",
         "QUY TẮC CHIA HẾT (N % C == 0):\nVới 6 thẻ bắt buộc 3 cột (3x2). Tuyệt đối không giữ lưới 4 cột khi tổng số thẻ là 6.",
         "Lấp đầy 100% chiều rộng khung nội dung; chia 2 hàng x 3 cột cân xứng tuyệt đối trên Desktop, 2 cột Tablet, 1 cột Mobile."),

        ("Khối Bento Grid nông sản\ncomponents/b2b/\ncatalog-section.tsx\n(#catalog-bento)",
         "Tại 2 thẻ hàng đầu (Rau củ quả, Thịt heo), chữ trắng đè lên ảnh nông sản sáng màu bị mờ chìm ('chữ trong suốt'), vi phạm WCAG.",
         "Thiết lập lớp overlay 3 tầng:\nlinear-gradient(180deg, rgba(6,20,14,0.82) 0%, rgba(6,20,14,0.60) 45%, rgba(6,20,14,0.90) 100%); textShadow: 0 2px 8px rgba(0,0,0,0.6); thẻ tag kính mờ backdropFilter: blur(6px).",
         "QUY TẮC BACKDROP OVERLAY:\nBắt buộc duy trì lớp overlay tối màu và textShadow. Tuyệt đối không xóa bỏ hay giảm opacity < 0.6.",
         "Chữ trắng sắc nét 100% trên mọi màn hình mà vẫn tôn vinh được vẻ tươi ngon, sinh động của hình ảnh nông sản."),

        ("Nút Báo Giá trên Header\ncomponents/\nsite-header.tsx\n(#header-rfq-btn)",
         "Hiển thị nhãn 'Yêu Cầu Báo Giá' (viết hoa chữ cái từng từ), chưa đồng nhất với các nút CTA trên toàn hệ thống.",
         "Chuẩn hóa nhãn nút thành 'Gửi yêu cầu báo giá' (viết hoa chữ đầu câu); href trỏ chuẩn về /bao-gia (VI) và /en/bao-gia (EN).",
         "QUY TẮC ROUTING BÁO GIÁ:\nLuôn dùng đường dẫn tuyệt đối /bao-gia. Tuyệt đối không dùng hash #rfq-form hay liên kết rỗng #.",
         "Tạo tính nhất quán 100% xuyên suốt toàn bộ website, nâng cao độ tin cậy và trải nghiệm người dùng."),

        ("Dải băng đối tác tin dùng\ncomponents/b2b/\npartner-ribbon.tsx",
         "Chữ bé, màu nhạt mờ vào nền trắng; icon ShieldCheck rườm rà gây chật chội trên thiết bị màn hình nhỏ.",
         "Lược bỏ icon ShieldCheck; thiết kế badge dạng viên thuốc nền #f0fdf4, chữ đậm 850 màu #133127, viền 2 đường chỉ thanh lịch hai bên.",
         "Không đặt logo đè lên các khối nội dung khác; đảm bảo độ tương phản của chữ tiêu đề ribbon trên nền sáng.",
         "Khối logo đối tác (Kirin, Vinschool, Bệnh viện Thống Nhất...) hiển thị nổi bật, trang nhã ngay dưới Hero."),

        ("Quy trình 3 bước & CTA\napp/page.tsx\n(dải chuyển đổi chân trang)",
         "Đường connector line đứt nối lệch khỏi tâm các vòng tròn số 01, 02, 03; nút CTA trỏ vào hash '#rfq-form' bị tê liệt khi bấm.",
         "Căn chỉnh top line (68px) xuyên đúng tâm trục số; sửa nút CTA trỏ thẳng về /bao-gia với nhãn 'Gửi yêu cầu báo giá'.",
         "Không gắn liên kết hash chết (#rfq-form) vào nút CTA chân trang; bảo toàn nhãn 'Gửi yêu cầu báo giá'.",
         "Trục kết nối thẳng hàng mượt mà; khách hàng bấm nút cuối trang được chuyển ngay sang form báo giá chính thức.")
    ]

    for row_idx, row_data in enumerate(t2_data, start=1):
        row_cells = t2.rows[row_idx].cells
        bg_col = "F9FAFB" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            row_cells[col_idx].width = spec_col_widths[col_idx]
            set_cell_background(row_cells[col_idx], bg_col)
            set_cell_margins(row_cells[col_idx], top=70, bottom=70, left=80, right=80)
            p = row_cells[col_idx].paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    # ==================== 2.2 DANH MỤC HÀNG HÓA ====================
    doc.add_page_break()

    p_s22 = doc.add_paragraph()
    p_s22.paragraph_format.space_before = Pt(12)
    p_s22.paragraph_format.space_after = Pt(6)
    r_s22 = p_s22.add_run("2.2. Điều chỉnh giao diện ở Danh mục hàng hóa (Trang Sản phẩm — app/san-pham/page.tsx)")
    r_s22.font.name = 'Times New Roman'
    r_s22.font.size = Pt(14)
    r_s22.font.bold = True
    r_s22.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    p_s22_intro = doc.add_paragraph()
    p_s22_intro.paragraph_format.line_spacing = 1.2
    p_s22_intro.paragraph_format.space_after = Pt(10)
    p_s22_intro.add_run(
        "Trang Sản phẩm (route: /san-pham) là nơi khách hàng B2B tra cứu hơn 5.000 mã hàng nông sản và thực phẩm tươi sống. "
        "Trước đây, phần Hero banner gặp lỗi ngắt dòng chữ tiếng Việt gây mất mỹ quan và khối thẻ Proof Card bị co cụm chật chội. "
        "Dưới đây là hình ảnh thực tế đối sánh trước — sau và bảng đặc tả kỹ thuật."
    )

    # Ảnh 2.2a & 2.2b
    p_c22 = doc.add_paragraph()
    p_c22.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c22.paragraph_format.space_before = Pt(10)
    p_c22.paragraph_format.space_after = Pt(4)
    r_c22 = p_c22.add_run("Bản hiện tại")
    r_c22.font.name = 'Times New Roman'
    r_c22.font.size = Pt(12.5)
    r_c22.font.bold = True

    img_b22_png = "docs/report_images/catalog_before.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794289761983_70ed1b60.jpg", img_b22_png)
    if os.path.exists(img_b22_png):
        p_img_b22 = doc.add_paragraph()
        p_img_b22.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_b22.paragraph_format.space_after = Pt(4)
        p_img_b22.add_run().add_picture(img_b22_png, width=Inches(6.4))

    p_cap_b22 = doc.add_paragraph()
    p_cap_b22.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_b22.paragraph_format.space_after = Pt(12)
    r_cap_b22 = p_cap_b22.add_run("Hình 2.2a: Giao diện ban đầu — Tiêu đề Hero ngắt dòng tự do khiến chữ 'phẩm' bị rơi xuống dòng dưới; khối thẻ Proof Card bên phải quá nhỏ; nút Header hiển thị nhãn cũ 'Yêu Cầu Báo Giá'.")
    r_cap_b22.font.name = 'Times New Roman'
    r_cap_b22.font.size = Pt(10.5)
    r_cap_b22.font.italic = True
    r_cap_b22.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

    p_a22 = doc.add_paragraph()
    p_a22.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_a22.paragraph_format.space_before = Pt(8)
    p_a22.paragraph_format.space_after = Pt(4)
    r_a22 = p_a22.add_run("Bản chỉnh sửa")
    r_a22.font.name = 'Times New Roman'
    r_a22.font.size = Pt(12.5)
    r_a22.font.bold = True
    r_a22.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    img_a22_png = "docs/report_images/catalog_after.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794289770017_e51ad831.jpg", img_a22_png)
    if os.path.exists(img_a22_png):
        p_img_a22 = doc.add_paragraph()
        p_img_a22.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_a22.paragraph_format.space_after = Pt(4)
        p_img_a22.add_run().add_picture(img_a22_png, width=Inches(6.4))

    p_cap_a22 = doc.add_paragraph()
    p_cap_a22.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_a22.paragraph_format.space_after = Pt(16)
    r_cap_a22 = p_cap_a22.add_run("Hình 2.2b: Giao diện sau tối ưu — Tiêu đề Hero ngắt dòng tròn vẹn 'Danh mục thực phẩm / được tuyển chọn mỗi ngày'; khối Proof Card phóng to chiếm 0.95fr bề thế; nút Header chuẩn 'Gửi yêu cầu báo giá'.")
    r_cap_a22.font.name = 'Times New Roman'
    r_cap_a22.font.size = Pt(10.5)
    r_cap_a22.font.italic = True
    r_cap_a22.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    # Bảng đặc tả kỹ thuật 2.2 (5 CỘT)
    p_t22_head = doc.add_paragraph()
    p_t22_head.paragraph_format.space_before = Pt(8)
    p_t22_head.paragraph_format.space_after = Pt(4)
    r_t22_head = p_t22_head.add_run("Bảng phân tích & Đặc tả kỹ thuật các cấu phần đã tối ưu tại Danh mục hàng hóa (/san-pham):")
    r_t22_head.font.name = 'Times New Roman'
    r_t22_head.font.size = Pt(13.5)
    r_t22_head.font.bold = True
    r_t22_head.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    t22 = doc.add_table(rows=5, cols=5)
    t22.alignment = WD_TABLE_ALIGNMENT.CENTER
    t22.autofit = False
    set_table_borders(t22, color="D1D5DB", sz="4", val="single")

    for i, title in enumerate(spec_col_headers):
        t22.rows[0].cells[i].width = spec_col_widths[i]
        set_cell_background(t22.rows[0].cells[i], "0F6F4B")
        set_cell_margins(t22.rows[0].cells[i], top=90, bottom=90, left=100, right=100)
        p = t22.rows[0].cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    t22_data = [
        ("Tiêu đề Hero Banner\napp/san-pham/page.tsx\n(dòng 45-51) &\napp/globals.css",
         "Từ 'thực phẩm' bị bẻ đôi, chữ 'phẩm' rớt xuống dòng thứ 2 một mình gây mất mỹ quan và làm đứt đoạn nghĩa.",
         "Bọc cụm từ trong span có class .sp-hero__title-white mang thuộc tính white-space: nowrap và ký tự không ngắt &nbsp; (Danh mục thực phẩm / được tuyển chọn mỗi ngày).",
         "QUY TẮC NOWRAP NGỮ NGHĨA:\nTuyệt đối không xóa bỏ thuộc tính white-space: nowrap trên tiêu đề tiếng Việt tại các màn hình 1280px - 1440px.",
         "Tiêu đề chia thành 2 dòng rõ nghĩa, tròn vẹn, không bao giờ bị rơi chữ lẻ trên mọi độ phân giải màn hình."),

        ("Bố cục lưới 2 cột Hero\napp/globals.css\n(.sp-hero__inner tại dòng 7136)",
         "Cột phải (Proof Card) co cụm nhỏ bé, lọt thỏm giữa khoảng trống bao la bên phải Hero banner.",
         "Cấu hình chuẩn Desktop:\ngrid-template-columns: minmax(0, 1.15fr) minmax(420px, 0.95fr); align-items: center; gap: clamp(32px, 5vw, 64px);.",
         "QUY TẮC TỶ LỆ LƯỚI HERO:\nCột bên phải (Proof Card) bắt buộc độ rộng tối thiểu 420px (minmax(420px, 0.95fr)). Tuyệt đối không thu hẹp dưới 400px.",
         "Khối Proof Card nở rộng bề thế, cân đối tuyệt đối với khối văn bản giới thiệu bên trái."),

        ("Thẻ chứng nhận năng lực\napp/globals.css\n(.sp-hero__proof-grid)",
         "Khối thẻ chứng nhận thiếu điểm nhấn, các số liệu năng lực (109+, 4 vùng) bị chìm.",
         "Thiết kế thẻ bo tròn border-radius: 26px; backdrop-filter: blur(12px); background: rgba(255,255,255,0.1); viền mờ 1px; số lớn dùng font-size: 1.45rem bold 900.",
         "Giữ nguyên 4 chỉ số bảo chứng: ISO 22000, 109+ khách hàng, 4 vùng phục vụ, lịch giao định kỳ theo bếp.",
         "Chứng chỉ ISO và các số liệu năng lực cung ứng nổi bật, củng cố niềm tin tuyệt đối cho khách hàng doanh nghiệp."),

        ("Nút cuộn mượt danh mục\napp/san-pham/page.tsx\n(dòng 58-79)",
         "Nút 'Khám phá danh mục ->' mang href='#danh-muc' nhưng thẻ nav danh mục bên dưới thiếu id='danh-muc' khiến nút bị liệt.",
         "Bổ sung thuộc tính id='danh-muc' tường minh vào thẻ <nav className='sku-group-links'>; thiết lập scroll-behavior: smooth trong CSS.",
         "QUY TẮC ANCHOR TARGET:\nTuyệt đối không xóa hoặc đổi tên thuộc tính id='danh-muc' trên thẻ nav nhóm hàng.",
         "Khách hàng bấm vào nút lập tức cuộn mượt xuống ngay khu vực nhóm hàng sản phẩm bên dưới.")
    ]

    for row_idx, row_data in enumerate(t22_data, start=1):
        row_cells = t22.rows[row_idx].cells
        bg_col = "F9FAFB" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            row_cells[col_idx].width = spec_col_widths[col_idx]
            set_cell_background(row_cells[col_idx], bg_col)
            set_cell_margins(row_cells[col_idx], top=70, bottom=70, left=80, right=80)
            p = row_cells[col_idx].paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    # ==================== 2.3 NGÀNH HÀNG ====================
    doc.add_page_break()

    p_s23 = doc.add_paragraph()
    p_s23.paragraph_format.space_before = Pt(12)
    p_s23.paragraph_format.space_after = Pt(6)
    r_s23 = p_s23.add_run("2.3. Điều chỉnh giao diện ở Ngành hàng (Hub Ngành hàng — app/nganh-hang/page.tsx)")
    r_s23.font.name = 'Times New Roman'
    r_s23.font.size = Pt(14)
    r_s23.font.bold = True
    r_s23.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    p_s23_intro = doc.add_paragraph()
    p_s23_intro.paragraph_format.line_spacing = 1.2
    p_s23_intro.paragraph_format.space_after = Pt(10)
    p_s23_intro.add_run(
        "Trang Hub Ngành hàng (route: /nganh-hang) phân loại giải pháp cung ứng cho 5 mô hình khách hàng trọng điểm: "
        "Nhà hàng khách sạn, Quán ăn chuỗi F&B, Bếp ăn công nghiệp, Trường học và Bệnh viện. "
        "Dưới đây là hình ảnh thực tế đối sánh trước — sau và bảng đặc tả kỹ thuật."
    )

    # Ảnh 2.3a & 2.3b
    p_c23 = doc.add_paragraph()
    p_c23.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c23.paragraph_format.space_before = Pt(10)
    p_c23.paragraph_format.space_after = Pt(4)
    r_c23 = p_c23.add_run("Bản hiện tại")
    r_c23.font.name = 'Times New Roman'
    r_c23.font.size = Pt(12.5)
    r_c23.font.bold = True

    img_b23_png = "docs/report_images/nganh_hang_before.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794290353272_8ad23148.jpg", img_b23_png)
    if os.path.exists(img_b23_png):
        p_img_b23 = doc.add_paragraph()
        p_img_b23.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_b23.paragraph_format.space_after = Pt(4)
        p_img_b23.add_run().add_picture(img_b23_png, width=Inches(6.4))

    p_cap_b23 = doc.add_paragraph()
    p_cap_b23.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_b23.paragraph_format.space_after = Pt(12)
    r_cap_b23 = p_cap_b23.add_run("Hình 2.3a: Giao diện ban đầu — 4 ô thống kê bị chìm phẳng dưới nền trắng; các thẻ ngành hàng có mô tả dài ngắn khác nhau khiến hàng tag dịch vụ bị so le cái cao cái thấp; nút Header ghi 'Yêu Cầu Báo Giá'.")
    r_cap_b23.font.name = 'Times New Roman'
    r_cap_b23.font.size = Pt(10.5)
    r_cap_b23.font.italic = True
    r_cap_b23.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

    p_a23 = doc.add_paragraph()
    p_a23.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_a23.paragraph_format.space_before = Pt(8)
    p_a23.paragraph_format.space_after = Pt(4)
    r_a23 = p_a23.add_run("Bản chỉnh sửa")
    r_a23.font.name = 'Times New Roman'
    r_a23.font.size = Pt(12.5)
    r_a23.font.bold = True
    r_a23.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    img_a23_png = "docs/report_images/nganh_hang_after.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794290361731_220afde4.jpg", img_a23_png)
    if os.path.exists(img_a23_png):
        p_img_a23 = doc.add_paragraph()
        p_img_a23.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_a23.paragraph_format.space_after = Pt(4)
        p_img_a23.add_run().add_picture(img_a23_png, width=Inches(6.4))

    p_cap_a23 = doc.add_paragraph()
    p_cap_a23.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_a23.paragraph_format.space_after = Pt(16)
    r_cap_a23 = p_cap_a23.add_run("Hình 2.3b: Giao diện sau tối ưu — 4 ô thống kê nổi bật gối nhẹ lên chân Hero; cơ chế Flexbox ghim thẳng tắp toàn bộ hàng tag dịch vụ và nút 'Xem chi tiết'; nút Header chuẩn 'Gửi yêu cầu báo giá'.")
    r_cap_a23.font.name = 'Times New Roman'
    r_cap_a23.font.size = Pt(10.5)
    r_cap_a23.font.italic = True
    r_cap_a23.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    # Bảng đặc tả kỹ thuật 2.3 (5 CỘT)
    p_t23_head = doc.add_paragraph()
    p_t23_head.paragraph_format.space_before = Pt(8)
    p_t23_head.paragraph_format.space_after = Pt(4)
    r_t23_head = p_t23_head.add_run("Bảng phân tích & Đặc tả kỹ thuật các cấu phần đã tối ưu tại Ngành hàng (/nganh-hang):")
    r_t23_head.font.name = 'Times New Roman'
    r_t23_head.font.size = Pt(13.5)
    r_t23_head.font.bold = True
    r_t23_head.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    t23 = doc.add_table(rows=5, cols=5)
    t23.alignment = WD_TABLE_ALIGNMENT.CENTER
    t23.autofit = False
    set_table_borders(t23, color="D1D5DB", sz="4", val="single")

    for i, title in enumerate(spec_col_headers):
        t23.rows[0].cells[i].width = spec_col_widths[i]
        set_cell_background(t23.rows[0].cells[i], "0F6F4B")
        set_cell_margins(t23.rows[0].cells[i], top=90, bottom=90, left=100, right=100)
        p = t23.rows[0].cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    t23_data = [
        ("Danh xưng 'Ngành Hàng'\napp/nganh-hang/page.tsx\ncomponents/site-header.tsx\nlib/site.ts",
         "Từng có nguy cơ bị đổi tên nhầm thành 'Danh mục' hoặc 'Sản phẩm', gây nhầm lẫn với trang sản phẩm (/san-pham).",
         "Bảo toàn 100% thuật ngữ 'Ngành Hàng' trên thanh điều hướng, URL slug /nganh-hang, tiêu đề và breadcrumbs.",
         "QUY TẮC BẢO TOÀN THUẬT NGỮ B2B:\nTuyệt đối không đổi tên 'Ngành Hàng' thành 'Danh mục'. Đây là từ khóa phân nhóm khách hàng B2B then chốt.",
         "Cấu trúc trang và hệ thống điều hướng logic, chuẩn SEO, giúp khách hàng nhận diện ngay mô hình bếp ăn của mình."),

        ("Cơ chế Flexbox thẻ lưới\napp/globals.css\n(.nganh-hub__card-desc &\n.nganh-hub__tags dòng 2448)",
         "Mô tả của các ngành hàng có độ dài ngắn khác nhau khiến các thẻ tag dịch vụ bị kéo thụt so le cái cao cái thấp rất mất thẩm mỹ.",
         "Thiết lập CSS chuẩn:\n.nganh-hub__card-desc { min-height: 74px; line-height: 1.7; font-size: 14.5px; }\n.nganh-hub__tags { margin-top: auto; padding-top: 14px; }.",
         "QUY TẮC FLEXBOX LEVELING:\nLuôn duy trì 'margin-top: auto' cho khối tags và min-height cho mô tả để các thẻ luôn thẳng hàng ngang.",
         "Các hàng tag dịch vụ và liên kết 'Xem chi tiết ->' luôn nằm thẳng hàng ngang tăm tắp trên mọi kích thước màn hình."),

        ("Bố cục 4 ô thống kê nổi\napp/globals.css\n(.nganh-hub__stats dòng 2346)",
         "4 ô thống kê bị chìm phẳng dưới nền trắng, tách rời không kết nối với Hero banner.",
         "Cấu hình lưới:\ngrid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-top: -20px; z-index: 2; box-shadow: 0 10px 30px rgba(0,0,0,0.05);.",
         "Duy trì margin-top âm (-20px) để tạo hiệu ứng gối đầu nhẹ lên chân Hero banner.",
         "Tạo chiều sâu không gian cho giao diện, làm nổi bật 4 thế mạnh: 109+ Doanh nghiệp, 5.000+ Mã hàng, 99.8% Đúng hẹn, Từ 2017."),

        ("Đồng bộ nút CTA Báo giá\napp/nganh-hang/page.tsx\n(khối Hero & cuối trang)",
         "Nút bấm mang các nhãn rời rạc 'Mở form báo giá ->' và nút Header mang nhãn cũ 'Yêu Cầu Báo Giá'.",
         "Chuẩn hóa thành 'Gửi yêu cầu báo giá' trỏ về /bao-gia, thiết kế bo góc 10px màu xanh thương hiệu #0f6f4b.",
         "Bảo toàn nhãn 'Gửi yêu cầu báo giá' và href='/bao-gia'.",
         "Đồng bộ nhận diện CTA với toàn bộ hệ thống website.")
    ]

    for row_idx, row_data in enumerate(t23_data, start=1):
        row_cells = t23.rows[row_idx].cells
        bg_col = "F9FAFB" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            row_cells[col_idx].width = spec_col_widths[col_idx]
            set_cell_background(row_cells[col_idx], bg_col)
            set_cell_margins(row_cells[col_idx], top=70, bottom=70, left=80, right=80)
            p = row_cells[col_idx].paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    # ==================== 2.4 QUY TRÌNH GIAO NHẬN ====================
    doc.add_page_break()

    p_s24 = doc.add_paragraph()
    p_s24.paragraph_format.space_before = Pt(12)
    p_s24.paragraph_format.space_after = Pt(6)
    r_s24 = p_s24.add_run("2.4. Điều chỉnh giao diện ở Quy trình giao nhận (Trang Quy trình — app/quy-trinh/page.tsx)")
    r_s24.font.name = 'Times New Roman'
    r_s24.font.size = Pt(14)
    r_s24.font.bold = True
    r_s24.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    p_s24_intro = doc.add_paragraph()
    p_s24_intro.paragraph_format.line_spacing = 1.2
    p_s24_intro.paragraph_format.space_after = Pt(10)
    p_s24_intro.add_run(
        "Trang Quy trình giao nhận (route: /quy-trinh) thuyết minh 6 bước vận hành khép kín đạt chuẩn ISO 22000 và HACCP của TPS1. "
        "Dưới đây là hình ảnh thực tế đối sánh trước — sau theo từng cụm và bảng đặc tả kỹ thuật."
    )

    # Cụm A
    p_g24a_head = doc.add_paragraph()
    p_g24a_head.paragraph_format.space_before = Pt(6)
    p_g24a_head.paragraph_format.space_after = Pt(4)
    r_g24a_head = p_g24a_head.add_run("A. Đồng bộ ảnh nền Hero Banner Quy trình giống 100% với trang Giới Thiệu:")
    r_g24a_head.font.name = 'Times New Roman'
    r_g24a_head.font.size = Pt(13.5)
    r_g24a_head.font.bold = True
    r_g24a_head.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    p_c24a = doc.add_paragraph()
    p_c24a.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c24a.paragraph_format.space_before = Pt(8)
    p_c24a.paragraph_format.space_after = Pt(4)
    r_c24a = p_c24a.add_run("Bản hiện tại")
    r_c24a.font.name = 'Times New Roman'
    r_c24a.font.size = Pt(12.5)
    r_c24a.font.bold = True

    img_b24a_png = "docs/report_images/quy_trinh_before.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794290432567_4bb38c67.jpg", img_b24a_png)
    if os.path.exists(img_b24a_png):
        p_img_b24a = doc.add_paragraph()
        p_img_b24a.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_b24a.paragraph_format.space_after = Pt(4)
        p_img_b24a.add_run().add_picture(img_b24a_png, width=Inches(6.4))

    p_cap_b24a = doc.add_paragraph()
    p_cap_b24a.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_b24a.paragraph_format.space_after = Pt(12)
    r_cap_b24a = p_cap_b24a.add_run("Hình 2.4a: Giao diện ban đầu — Banner Hero màu xanh phẳng nhạt nhòa (washed-out); nút Header ghi 'Yêu Cầu Báo Giá'.")
    r_cap_b24a.font.name = 'Times New Roman'
    r_cap_b24a.font.size = Pt(10.5)
    r_cap_b24a.font.italic = True
    r_cap_b24a.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

    p_a24a = doc.add_paragraph()
    p_a24a.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_a24a.paragraph_format.space_before = Pt(8)
    p_a24a.paragraph_format.space_after = Pt(4)
    r_a24a = p_a24a.add_run("Bản chỉnh sửa")
    r_a24a.font.name = 'Times New Roman'
    r_a24a.font.size = Pt(12.5)
    r_a24a.font.bold = True
    r_a24a.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    img_a24a_png = "docs/report_images/quy_trinh_after.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794290469498_82f3cd3e.jpg", img_a24a_png)
    if os.path.exists(img_a24a_png):
        p_img_a24a = doc.add_paragraph()
        p_img_a24a.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_a24a.paragraph_format.space_after = Pt(4)
        p_img_a24a.add_run().add_picture(img_a24a_png, width=Inches(6.4))

    p_cap_a24a = doc.add_paragraph()
    p_cap_a24a.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_a24a.paragraph_format.space_after = Pt(16)
    r_cap_a24a = p_cap_a24a.add_run("Hình 2.4b: Giao diện sau tối ưu — Banner Hero sử dụng chung ảnh phòng họp thực tế TPS1 với lớp phủ multiply màu xanh rừng đậm sâu giống 100% trang Giới Thiệu; nút Header chuẩn 'Gửi yêu cầu báo giá'.")
    r_cap_a24a.font.name = 'Times New Roman'
    r_cap_a24a.font.size = Pt(10.5)
    r_cap_a24a.font.italic = True
    r_cap_a24a.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    # Cụm B
    p_g24b_head = doc.add_paragraph()
    p_g24b_head.paragraph_format.space_before = Pt(8)
    p_g24b_head.paragraph_format.space_after = Pt(4)
    r_g24b_head = p_g24b_head.add_run("B. Tách rời toàn bộ icon vào trục ray giữa (.b2b-timeline__dot) & phóng to chữ BƯỚC:")
    r_g24b_head.font.name = 'Times New Roman'
    r_g24b_head.font.size = Pt(13.5)
    r_g24b_head.font.bold = True
    r_g24b_head.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    p_c24b = doc.add_paragraph()
    p_c24b.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c24b.paragraph_format.space_before = Pt(8)
    p_c24b.paragraph_format.space_after = Pt(4)
    r_c24b = p_c24b.add_run("Bản hiện tại")
    r_c24b.font.name = 'Times New Roman'
    r_c24b.font.size = Pt(12.5)
    r_c24b.font.bold = True

    img_b24b_png = "docs/report_images/quy_trinh_step_before.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794290890521_bea45bb3.jpg", img_b24b_png)
    if os.path.exists(img_b24b_png):
        p_img_b24b = doc.add_paragraph()
        p_img_b24b.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_b24b.paragraph_format.space_after = Pt(4)
        p_img_b24b.add_run().add_picture(img_b24b_png, width=Inches(6.4))

    p_cap_b24b = doc.add_paragraph()
    p_cap_b24b.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_b24b.paragraph_format.space_after = Pt(12)
    r_cap_b24b = p_cap_b24b.add_run("Hình 2.4c: Giao diện ban đầu — Các ô icon vuông màu xanh lấn vào trong cột nội dung, dính sát đè lên chữ 'BƯỚC' gây chật chội và rối mắt; chữ 'BƯỚC' nhỏ và chìm; nút Header ghi 'Yêu Cầu Báo Giá'.")
    r_cap_b24b.font.name = 'Times New Roman'
    r_cap_b24b.font.size = Pt(10.5)
    r_cap_b24b.font.italic = True
    r_cap_b24b.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

    p_a24b = doc.add_paragraph()
    p_a24b.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_a24b.paragraph_format.space_before = Pt(8)
    p_a24b.paragraph_format.space_after = Pt(4)
    r_a24b = p_a24b.add_run("Bản chỉnh sửa")
    r_a24b.font.name = 'Times New Roman'
    r_a24b.font.size = Pt(12.5)
    r_a24b.font.bold = True
    r_a24b.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    img_a24b_png = "docs/report_images/quy_trinh_step_after.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794290900086_50c1d9eb.jpg", img_a24b_png)
    if os.path.exists(img_a24b_png):
        p_img_a24b = doc.add_paragraph()
        p_img_a24b.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_a24b.paragraph_format.space_after = Pt(4)
        p_img_a24b.add_run().add_picture(img_a24b_png, width=Inches(6.4))

    p_cap_a24b = doc.add_paragraph()
    p_cap_a24b.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_a24b.paragraph_format.space_after = Pt(16)
    r_cap_a24b = p_cap_a24b.add_run("Hình 2.4d: Giao diện sau tối ưu — Toàn bộ icon được tách chuyển vào các chấm tròn xanh trên trục ray giữa (.b2b-timeline__dot); chữ 'BƯỚC' được giải phóng và phóng to lên 1.25rem đậm 900 nổi bật độc lập; nút Header đồng bộ 'Gửi yêu cầu báo giá'.")
    r_cap_a24b.font.name = 'Times New Roman'
    r_cap_a24b.font.size = Pt(10.5)
    r_cap_a24b.font.italic = True
    r_cap_a24b.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    # Bảng đặc tả kỹ thuật 2.4 (5 CỘT)
    p_t24_head = doc.add_paragraph()
    p_t24_head.paragraph_format.space_before = Pt(8)
    p_t24_head.paragraph_format.space_after = Pt(4)
    r_t24_head = p_t24_head.add_run("Bảng phân tích & Đặc tả kỹ thuật các cấu phần đã tối ưu tại Quy trình giao nhận (/quy-trinh):")
    r_t24_head.font.name = 'Times New Roman'
    r_t24_head.font.size = Pt(13.5)
    r_t24_head.font.bold = True
    r_t24_head.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    t24 = doc.add_table(rows=5, cols=5)
    t24.alignment = WD_TABLE_ALIGNMENT.CENTER
    t24.autofit = False
    set_table_borders(t24, color="D1D5DB", sz="4", val="single")

    for i, title in enumerate(spec_col_headers):
        t24.rows[0].cells[i].width = spec_col_widths[i]
        set_cell_background(t24.rows[0].cells[i], "0F6F4B")
        set_cell_margins(t24.rows[0].cells[i], top=90, bottom=90, left=100, right=100)
        p = t24.rows[0].cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    t24_data = [
        ("Ảnh nền Hero Banner\napp/quy-trinh/page.tsx\n(dòng 55-79) &\napp/globals.css",
         "Banner dùng gradient phẳng và ảnh mờ opacity: 0.15, tạo màu xanh nhạt bạc màu, lệch tông hoàn toàn so với trang Giới Thiệu.",
         "Dùng chung asset ảnh /images/about/hero_v2.jpg fill full màn hình, kết hợp overlay linear-gradient(180deg, rgba(15,111,75,0.7) 0%, rgba(10,50,30,0.95) 100%) và mix-blend-mode: multiply.",
         "QUY TẮC ĐỒNG BỘ HERO:\nBắt buộc dùng chung ảnh hero_v2.jpg và mix-blend-mode: multiply. Tuyệt đối không dùng pseudo ::before phẳng nhạt nhòa.",
         "Hai trang Quy Trình và Giới Thiệu đạt độ tương đồng 100% về độ sáng, màu xanh rừng nhận diện và tính chuyên nghiệp."),

        ("Chấm tròn Icon Timeline\napp/quy-trinh/page.tsx\n(dòng 103-108) &\napp/globals.css (.b2b-timeline__dot)",
         "Các ô icon hình vuông bo góc nằm lấn vào trong cột nội dung, dính sát đè lên chữ 'BƯỚC' gây chật chội và rối mắt.",
         "Đưa icon vào chấm tròn xanh (.b2b-timeline__dot, kích thước 56x56px, border 5px #dcfce7) trên trục ray giữa; ẩn icon thừa trên Desktop (.b2b-timeline__mobile-icon: none).",
         "QUY TẮC VỊ TRÍ ICON TIMELINE:\nTrên Desktop, icon bắt buộc nằm tại chấm tròn giữa .b2b-timeline__dot. Tuyệt đối không kéo icon vào cột văn bản.",
         "Giao diện thoáng đãng, các mốc timeline hiển thị như các trạm kiểm soát chuyên nghiệp, phân tách rành mạch."),

        ("Kích thước chữ 'BƯỚC'\napp/globals.css\n(.b2b-timeline__step-num)",
         "Chữ 'BƯỚC 01', 'BƯỚC 02' bị nhỏ, mờ nhạt, không tạo được điểm nhấn phân biệt rõ ràng giữa các giai đoạn.",
         "Phóng to chữ lên font-size: 1.25rem (20px), font-weight: 900, màu xanh #0f6f4b, giãn chữ letter-spacing: 1.5px, text-transform: uppercase.",
         "Giữ nguyên class .b2b-timeline__step-num và định dạng chữ hoa đậm 900.",
         "Thứ tự từng bước hiển thị nổi bật, dứt khoát, dễ theo dõi cho đối tác B2B khi tra cứu quy trình."),

        ("Đồng bộ nút Header\ncomponents/\nsite-header.tsx",
         "Nút trên Header mang nhãn cũ 'Yêu Cầu Báo Giá' chưa đồng nhất với toàn bộ hệ thống.",
         "Chuẩn hóa nút Header thành 'Gửi yêu cầu báo giá' (nền xanh nhận diện thương hiệu #0f6f4b, chữ trắng).",
         "Bảo toàn nhãn 'Gửi yêu cầu báo giá' và đường dẫn trỏ về /bao-gia.",
         "Toàn bộ các trang từ Trang chủ, Sản phẩm, Ngành hàng đến Quy trình đều đạt chuẩn đồng nhất 100%.")
    ]

    for row_idx, row_data in enumerate(t24_data, start=1):
        row_cells = t24.rows[row_idx].cells
        bg_col = "F9FAFB" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            row_cells[col_idx].width = spec_col_widths[col_idx]
            set_cell_background(row_cells[col_idx], bg_col)
            set_cell_margins(row_cells[col_idx], top=70, bottom=70, left=80, right=80)
            p = row_cells[col_idx].paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    # ==================== 2.5 TRANG LIÊN HỆ ====================
    doc.add_page_break()

    p_s25 = doc.add_paragraph()
    p_s25.paragraph_format.space_before = Pt(12)
    p_s25.paragraph_format.space_after = Pt(6)
    r_s25 = p_s25.add_run("2.5. Điều chỉnh giao diện ở Trang Liên hệ (Trang Liên hệ & Tư vấn — app/lien-he/page.tsx)")
    r_s25.font.name = 'Times New Roman'
    r_s25.font.size = Pt(14)
    r_s25.font.bold = True
    r_s25.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    p_s25_intro = doc.add_paragraph()
    p_s25_intro.paragraph_format.line_spacing = 1.2
    p_s25_intro.paragraph_format.space_after = Pt(10)
    p_s25_intro.add_run(
        "Trang Liên hệ đóng vai trò là kênh tiếp nhận thông tin kết nối trực tiếp giữa các doanh nghiệp, bếp ăn B2B và TPS1. "
        "Trước đây, trang gặp lỗi sai lệch nghiêm trọng về mặt ngữ nghĩa và mục tiêu chuyển đổi khi tiêu đề chính và biểu mẫu lại "
        "mang nội dung 'Gửi yêu cầu báo giá' (gây trùng lặp và nhầm lẫn với Cổng báo giá chính thức /bao-gia). "
        "Dưới đây là hình ảnh thực tế đối sánh trước — sau và bảng đặc tả kỹ thuật."
    )

    # Ảnh 2.5a & 2.5b
    p_c25 = doc.add_paragraph()
    p_c25.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c25.paragraph_format.space_before = Pt(10)
    p_c25.paragraph_format.space_after = Pt(4)
    r_c25 = p_c25.add_run("Bản hiện tại")
    r_c25.font.name = 'Times New Roman'
    r_c25.font.size = Pt(12.5)
    r_c25.font.bold = True

    img_b25_png = "docs/report_images/contact_before.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794292387931_63931d0d.jpg", img_b25_png)
    if os.path.exists(img_b25_png):
        p_img_b25 = doc.add_paragraph()
        p_img_b25.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_b25.paragraph_format.space_after = Pt(4)
        p_img_b25.add_run().add_picture(img_b25_png, width=Inches(6.4))

    p_cap_b25 = doc.add_paragraph()
    p_cap_b25.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_b25.paragraph_format.space_after = Pt(12)
    r_cap_b25 = p_cap_b25.add_run("Hình 2.5a: Giao diện ban đầu trang Liên hệ — Tiêu đề Hero mang nội dung 'Gửi yêu cầu báo giá' sai lệch bản chất trang liên hệ; Form mang nhãn 'Yêu cầu tư vấn' và trường 'Nhu cầu' chưa tối ưu; quy trình 4 bước chưa phản ánh đúng quy trình tiếp nhận & đồng hành; nút Header mang nhãn cũ 'Yêu Cầu Báo Giá'.")
    r_cap_b25.font.name = 'Times New Roman'
    r_cap_b25.font.size = Pt(10.5)
    r_cap_b25.font.italic = True
    r_cap_b25.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

    p_a25 = doc.add_paragraph()
    p_a25.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_a25.paragraph_format.space_before = Pt(8)
    p_a25.paragraph_format.space_after = Pt(4)
    r_a25 = p_a25.add_run("Bản chỉnh sửa")
    r_a25.font.name = 'Times New Roman'
    r_a25.font.size = Pt(12.5)
    r_a25.font.bold = True
    r_a25.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    img_a25_png = "docs/report_images/contact_after.png"
    ensure_png("C:/Users/DaoNguyenHaiDang/.gemini/antigravity/brain/57318b3f-6414-4dc4-80bd-884920e1f6da/.user_uploaded/media_1794292395961_9bcc8428.jpg", img_a25_png)
    if os.path.exists(img_a25_png):
        p_img_a25 = doc.add_paragraph()
        p_img_a25.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_a25.paragraph_format.space_after = Pt(4)
        p_img_a25.add_run().add_picture(img_a25_png, width=Inches(6.4))

    p_cap_a25 = doc.add_paragraph()
    p_cap_a25.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_a25.paragraph_format.space_after = Pt(16)
    r_cap_a25 = p_cap_a25.add_run("Hình 2.5b: Giao diện sau tối ưu — Tiêu đề Hero chuẩn hóa dứt khoát thành 'Liên hệ tư vấn' (với từ 'tư vấn' xanh nhận diện #4ade80); Form cập nhật huy hiệu 'Liên hệ tư vấn', trường 'Nội dung liên hệ' và nút 'Gửi liên hệ'; Quy trình 4 bước tiếp nhận chuẩn hóa chuyên nghiệp; nút Header đồng bộ 'Gửi yêu cầu báo giá'.")
    r_cap_a25.font.name = 'Times New Roman'
    r_cap_a25.font.size = Pt(10.5)
    r_cap_a25.font.italic = True
    r_cap_a25.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    # Bảng đặc tả kỹ thuật 2.5 (5 CỘT)
    p_t25_head = doc.add_paragraph()
    p_t25_head.paragraph_format.space_before = Pt(8)
    p_t25_head.paragraph_format.space_after = Pt(4)
    r_t25_head = p_t25_head.add_run("Bảng phân tích & Đặc tả kỹ thuật các cấu phần đã tối ưu tại Trang Liên hệ (/lien-he):")
    r_t25_head.font.name = 'Times New Roman'
    r_t25_head.font.size = Pt(13.5)
    r_t25_head.font.bold = True
    r_t25_head.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    t25 = doc.add_table(rows=5, cols=5)
    t25.alignment = WD_TABLE_ALIGNMENT.CENTER
    t25.autofit = False
    set_table_borders(t25, color="D1D5DB", sz="4", val="single")

    for i, title in enumerate(spec_col_headers):
        t25.rows[0].cells[i].width = spec_col_widths[i]
        set_cell_background(t25.rows[0].cells[i], "0F6F4B")
        set_cell_margins(t25.rows[0].cells[i], top=90, bottom=90, left=100, right=100)
        p = t25.rows[0].cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    t25_data = [
        ("Tiêu đề Hero Banner\napp/lien-he/page.tsx\n(dòng 50-55)",
         "Tiêu đề H1 mang nhãn 'Gửi yêu cầu báo giá' và mô tả tập trung báo giá số lượng, gây hiểu nhầm đây là trang báo giá.",
         "Đổi H1 thành: Liên hệ <span style={{ color: '#4ade80' }}>tư vấn</span>; viết lại mô tả nhấn mạnh vai trò kết nối trực tiếp, tư vấn giải pháp cung ứng B2B.",
         "QUY TẮC NGỮ NGHĨA LIÊN HỆ:\nTrang /lien-he bắt buộc giữ tiêu đề 'Liên hệ tư vấn'. Tuyệt đối không đổi thành 'Gửi yêu cầu báo giá'.",
         "Định vị chính xác 100% mục đích trang liên hệ, thông điệp rõ ràng, tách bạch hoàn toàn với Cổng báo giá /bao-gia."),

        ("Biểu mẫu liên hệ\ncomponents/\nlead-form.tsx\n(dòng 58-88)",
         "Form hiển thị chung chung 'Yêu cầu tư vấn', nhãn ô nhập là 'Nhu cầu' với placeholder mô tả loại hàng gây nhầm lẫn với form báo giá sản phẩm.",
         "Tách biệt logic theo mode === 'contact': Cập nhật huy hiệu 'Liên hệ tư vấn', mô tả cam kết phản hồi nhanh 30 phút, nhãn trường 'Nội dung liên hệ', placeholder mở rộng; nút 'Gửi liên hệ'.",
         "QUY TẮC COMPONENT MODE:\nTrang /lien-he bắt buộc truyền <LeadForm mode='contact' />. Nút submit luôn là 'Gửi liên hệ' gửi về /api/contact.",
         "Biểu mẫu thân thiện, chuyên nghiệp, khuyến khích đối tác để lại câu hỏi, lời mời hợp tác kinh doanh thuận tiện."),

        ("Khối Quy trình 4 bước\napp/lien-he/page.tsx\n(dòng 34-39)",
         "Bước 02 ghi 'Nhận báo giá / Trong 2 giờ làm việc' mang tính chất đơn hàng thuần túy, chưa phản ánh đúng quy trình tiếp nhận đối tác lâu dài.",
         "Chuẩn hóa thành quy trình tiếp nhận đối tác:\n01. Gửi thông tin -> 02. Tiếp nhận & Tư vấn (30 phút) -> 03. Lên phương án (Báo giá & mẫu) -> 04. Hợp tác & Giao hàng.",
         "Quy chuẩn 4 bước tiếp nhận đối tác B2B đồng bộ với cam kết phản hồi trong 30 phút.",
         "Đối tác B2B nắm rõ lộ trình từ lúc kết nối ban đầu đến khi ký hợp đồng và nhận hàng thực phẩm an tâm tuyệt đối."),

        ("Đồng bộ nút Header &\nSEO Metadata\napp/lien-he/page.tsx &\nsite-header.tsx",
         "Thẻ title cũ là 'Liên hệ và yêu cầu báo giá'; nút Header hiển thị nhãn cũ 'Yêu Cầu Báo Giá'.",
         "Cập nhật title thành 'Liên hệ tư vấn | Thực Phẩm Số Một (TPS1)'; đồng bộ nút Header toàn hệ thống thành 'Gửi yêu cầu báo giá' trỏ về /bao-gia.",
         "Bảo toàn nhãn 'Gửi yêu cầu báo giá' và đường dẫn trỏ về /bao-gia.",
         "Đồng bộ nhận diện thương hiệu trên thanh điều hướng, chuẩn hóa trải nghiệm người dùng và tối ưu chỉ số SEO.")
    ]

    for row_idx, row_data in enumerate(t25_data, start=1):
        row_cells = t25.rows[row_idx].cells
        bg_col = "F9FAFB" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            row_cells[col_idx].width = spec_col_widths[col_idx]
            set_cell_background(row_cells[col_idx], bg_col)
            set_cell_margins(row_cells[col_idx], top=70, bottom=70, left=80, right=80)
            p = row_cells[col_idx].paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    # ==================== PHẦN 3: TỔNG HỢP CÁC NỘI DUNG VĂN BẢN ĐÃ ĐIỀU CHỈNH ====================
    doc.add_page_break()

    p_s3 = doc.add_paragraph()
    p_s3.paragraph_format.space_before = Pt(12)
    p_s3.paragraph_format.space_after = Pt(6)
    r_s3 = p_s3.add_run("3. TỔNG HỢP CÁC NỘI DUNG VĂN BẢN (COPYWRITING / CONTENT) ĐÃ RÀ SOÁT & ĐỒNG BỘ")
    r_s3.font.name = 'Times New Roman'
    r_s3.font.size = Pt(15)
    r_s3.font.bold = True
    r_s3.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    p_s31 = doc.add_paragraph()
    p_s31.paragraph_format.space_before = Pt(6)
    p_s31.paragraph_format.space_after = Pt(4)
    r_s31 = p_s31.add_run("3.1. Bối cảnh & Nguyên tắc chuẩn hóa nội dung toàn hệ thống")
    r_s31.font.name = 'Times New Roman'
    r_s31.font.size = Pt(14)
    r_s31.font.bold = True
    r_s31.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    p_s31_body = doc.add_paragraph()
    p_s31_body.paragraph_format.line_spacing = 1.2
    p_s31_body.paragraph_format.space_after = Pt(8)
    p_s31_body.add_run(
        "Bên cạnh việc tối ưu giao diện và xử lý lỗi kỹ thuật nút bấm, tính nhất quán trong thông điệp truyền thông "
        "và các cam kết dịch vụ đóng vai trò then chốt trong việc tạo dựng lòng tin với các đối tác B2B (nhà hàng, khách sạn, "
        "bếp ăn công nghiệp, trường học). Trước khi rà soát, website TPS1 xuất hiện sự không đồng nhất giữa các trang về cam kết "
        "thời gian phản hồi (nơi ghi '15 phút', nơi ghi '2 tiếng / 2 giờ', nơi ghi '24 giờ'), sự phân mảnh của các nhãn nút "
        "kêu gọi hành động (CTA), và việc dùng nhầm ngôn từ giữa trang Liên hệ và trang Báo giá. "
        "Toàn bộ các nội dung văn bản này đã được rà soát và chuẩn hóa 100% theo các nguyên tắc cốt lõi sau:"
    )

    principles = [
        ("Nguyên tắc cam kết thời gian kép (Two-tier Time Commitment):", " Tách bạch rõ ràng 2 mốc thời gian độc lập: 'Xác nhận thông tin trong 30 phút' (liên hệ điện thoại thẩm tra nhu cầu) và 'Hoàn thành gửi bảng báo giá sỉ chi tiết trong vòng 24 giờ' (tính toán phương án đơn giá và chính sách công nợ). Loại bỏ triệt để các con số mâu thuẫn như 15 phút hay 2 tiếng."),
        ("Nguyên tắc đồng nhất nhãn hành động (CTA Consistency):", " Thống nhất một nhãn duy nhất 'Gửi yêu cầu báo giá' trên toàn bộ các điểm chuyển đổi từ Header, Footer, Hero đến các trang con, loại bỏ hoàn toàn các biến thể rời rạc gây bối rối cho khách hàng."),
        ("Nguyên tắc định vị đúng ngữ nghĩa trang (Semantic Clarity):", " Phân biệt tuyệt đối giữa Trang Liên Hệ (/lien-he — phục vụ kết nối đối tác, giải đáp thắc mắc, tư vấn dịch vụ) và Trang Báo Giá (/bao-gia — phục vụ chào hàng và lên đơn giá sỉ)."),
        ("Nguyên tắc ngắt dòng ngữ nghĩa tiếng Việt (Typography Integrity):", " Cố định các từ ghép tiếng Việt có nghĩa ('thực phẩm', 'mỗi ngày', 'đúng nhịp bếp') bằng cơ chế nowrap để tránh bị ngắt dòng rơi chữ lẻ loi.")
    ]
    for p_title, p_desc in principles:
        p_pr = doc.add_paragraph()
        p_pr.paragraph_format.line_spacing = 1.15
        p_pr.paragraph_format.space_after = Pt(3)
        p_pr.paragraph_format.left_indent = Inches(0.2)
        r_pt = p_pr.add_run(f"• {p_title}")
        r_pt.font.name = 'Times New Roman'
        r_pt.font.size = Pt(12.5)
        r_pt.font.bold = True
        r_pt.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)
        r_pd = p_pr.add_run(p_desc)
        r_pd.font.name = 'Times New Roman'
        r_pd.font.size = Pt(12.5)

    # 3.2 Bảng tổng hợp nội dung
    p_s32 = doc.add_paragraph()
    p_s32.paragraph_format.space_before = Pt(10)
    p_s32.paragraph_format.space_after = Pt(4)
    r_s32 = p_s32.add_run("3.2. Bảng tổng hợp chi tiết 6 hạng mục nội dung văn bản đã chuẩn hóa:")
    r_s32.font.name = 'Times New Roman'
    r_s32.font.size = Pt(14)
    r_s32.font.bold = True
    r_s32.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    t3 = doc.add_table(rows=7, cols=5)
    t3.alignment = WD_TABLE_ALIGNMENT.CENTER
    t3.autofit = False
    set_table_borders(t3, color="D1D5DB", sz="4", val="single")

    t3_widths = [Inches(0.4), Inches(1.5), Inches(1.5), Inches(1.8), Inches(1.7)]
    t3_headers = ["STT", "Hạng mục & Vị trí", "Nội dung cũ (Trước sửa)", "Nội dung chuẩn hóa (Sau sửa)", "Mục đích & Ý nghĩa thay đổi"]

    for i, title in enumerate(t3_headers):
        t3.rows[0].cells[i].width = t3_widths[i]
        set_cell_background(t3.rows[0].cells[i], "0F6F4B")
        set_cell_margins(t3.rows[0].cells[i], top=90, bottom=90, left=100, right=100)
        p = t3.rows[0].cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    t3_data = [
        ("1",
         "Cam kết thời gian phản hồi khách hàng\n• Trang Liên hệ (app/lien-he/page.tsx)\n• Form nhanh (quick-quote-form.tsx)\n• Cổng Báo giá (quote-portal.tsx)",
         "MÂU THUẪN ĐA CHIỀU:\n- Trang liên hệ ghi: 'Phản hồi trong 2 giờ' (hoặc 2 tiếng) và Bước 02 'Trong 2 giờ làm việc'.\n- Màn hình form nhanh ghi: 'Phản hồi trong 24 giờ' để xác nhận nhu cầu.\n- Cổng báo giá ghi: 'Liên hệ trong vòng 15 phút'.",
         "ĐỒNG BỘ CAM KẾT KÉP:\n- 'Xác nhận trong 30 phút': Chuyên viên kinh doanh chủ động gọi điện thẩm tra nhu cầu trong vòng 30 phút giờ hành chính.\n- 'Báo giá trong 24 giờ': Hoàn thành bảng báo giá chi tiết, phân nhóm và chiết khấu trong vòng 24 giờ.",
         "Khắc phục hoàn toàn tình trạng 'trống đánh xuôi, kèn thổi ngược'; tạo cam kết vận hành chuyên nghiệp, khả thi và đáng tin cậy với khách hàng B2B."),

        ("2",
         "Nhãn nút kêu gọi hành động (CTA Nút Báo Giá)\n• Header (components/site-header.tsx)\n• Footer (components/site-footer.tsx)\n• CTA trang chủ & các trang con",
         "PHÂN MẢNH NHÃN NÚT:\n- Header: 'Yêu Cầu Báo Giá' (viết hoa chữ cái từng từ).\n- Footer: 'Mở form báo giá'.\n- Trang Nhận Báo Giá: 'Điền form báo giá nhanh'.\n- Nút form nhanh: 'Nhận báo giá trong 24h'.",
         "CHUẨN HÓA DUY NHẤT 1 NHÃN:\n- Toàn bộ nút CTA trên thanh điều hướng Header, chân trang Footer và các khối chuyển đổi đều sử dụng duy nhất nhãn: 'Gửi yêu cầu báo giá' (viết hoa chữ đầu câu).\n- Đường dẫn trỏ chuẩn về /bao-gia (VI) và /en/bao-gia (EN).",
         "Tạo tính nhất quán tuyệt đối trong trải nghiệm nhận diện thương hiệu, tránh làm người dùng bối rối trước nhiều tên gọi khác nhau của cùng một tính năng."),

        ("3",
         "Tiêu đề & Nội dung biểu mẫu Trang Liên Hệ\n• app/lien-he/page.tsx\n• components/lead-form.tsx",
         "SAI LỆCH NGỮ NGHĨA TRANG:\n- Tiêu đề Hero: 'Gửi yêu cầu báo giá' (trùng lặp với trang Báo Giá).\n- Mô tả tập trung vào việc báo giá số lượng hàng.\n- Form mang nhãn: 'Yêu cầu tư vấn', trường 'Nhu cầu' với gợi ý mô tả hàng hóa.",
         "ĐỊNH VỊ ĐÚNG CHUẨN LIÊN HỆ:\n- Tiêu đề Hero: 'Liên hệ tư vấn' (từ 'tư vấn' xanh #4ade80).\n- Mô tả hướng tới kết nối, tư vấn giải pháp và hợp tác B2B.\n- Form: Huy hiệu 'Liên hệ tư vấn', nhãn 'Nội dung liên hệ', placeholder mở rộng câu hỏi trao đổi hợp tác.",
         "Phân định rõ ranh giới chức năng: /lien-he dành cho giao tiếp, kết nối đối tác; /bao-gia dành cho lập dự toán báo giá sỉ."),

        ("4",
         "Danh từ thương hiệu 'Ngành Hàng' (B2B Segments)\n• Menu Header & Breadcrumbs\n• app/nganh-hang/page.tsx",
         "NHẦM LẪN THUẬT NGỮ:\n- Một số điểm tương tác từng gọi nhầm 'Ngành Hàng' thành 'Danh mục' hoặc 'Sản phẩm', gây xung đột với trang Danh mục hàng hóa (/san-pham).",
         "BẢO LƯU CHUẨN MỰC 'NGÀNH HÀNG':\n- Duy trì 100% danh xưng 'Ngành Hàng' (URL: /nganh-hang) đại diện cho giải pháp cung ứng theo mô hình bếp: Nhà hàng, Quán ăn F&B, Bếp công nghiệp, Trường học, Bệnh viện.",
         "Định vị giải pháp may đo riêng biệt cho từng gian bếp B2B, bảo tồn cấu trúc dữ liệu và điểm SEO tích lũy."),

        ("5",
         "Văn bản mô tả nông sản khối Bento Grid\n• components/b2b/catalog-section.tsx (Khối Danh mục sản phẩm trang chủ)",
         "MÔ TẢ CŨ NGẮN & THIẾU CHI TIẾT:\n- Đoạn văn cũ ngắn, chưa toát lên được năng lực kiểm soát nguồn hàng và quy chuẩn giao nhận lạnh của TPS1.",
         "VIẾT LẠI GIÀU HÌNH ẢNH & CHI TIẾT:\n- Rau củ quả: Làm nổi bật nguồn gốc Đà Lạt, miền Tây, Bảo Lộc hái mỗi ngày; bổ sung 3 cam kết: Nguồn Đà Lạt & miền Tây, Phân loại theo kích cỡ, Giao đúng ca bếp.\n- Thịt heo: Nhấn mạnh kiểm dịch nhập kho và giữ lạnh suốt đường giao; bổ sung 3 cam kết: Cắt đúng quy cách bếp, Kiểm tra kỹ khi nhập kho, Giữ lạnh suốt đường giao.",
         "Nâng cao sức thuyết phục về chất lượng nguyên liệu tươi sống, củng cố cam kết chuẩn mực an toàn thực phẩm của TPS1."),

        ("6",
         "Ngắt dòng ngữ nghĩa từ ghép Tiếng Việt (Typography No-wrap)\n• Tiêu đề trang Sản phẩm, Quy trình, Trang chủ",
         "RỚT CHỮ LẺ LOI MẤT MỸ QUAN:\n- Trình duyệt tự do bẻ dòng các từ ghép tiếng Việt, khiến chữ 'phẩm' trong 'thực phẩm' hoặc 'ngày' trong 'mỗi ngày' bị rớt một mình xuống dòng dưới trên màn hình laptop.",
         "ÁP DỤNG CƠ CHẾ NOWRAP NGỮ NGHĨA:\n- Bọc các từ ghép tiếng Việt trọn vẹn trong các thẻ span mang thuộc tính white-space: nowrap và ký tự khoảng trắng không ngắt &nbsp; (ví dụ: 'thực phẩm', 'mỗi ngày', 'đúng nhịp bếp', '24 giờ').",
         "Tiêu đề luôn ngắt dòng tròn vành rõ chữ, chuẩn mực văn phong báo chí và giao diện thương mại điện tử cao cấp.")
    ]

    for row_idx, row_data in enumerate(t3_data, start=1):
        row_cells = t3.rows[row_idx].cells
        bg_col = "F9FAFB" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            row_cells[col_idx].width = t3_widths[col_idx]
            set_cell_background(row_cells[col_idx], bg_col)
            set_cell_margins(row_cells[col_idx], top=70, bottom=70, left=80, right=80)
            p = row_cells[col_idx].paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            if col_idx == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    # 3.3 Phân tích chi tiết trường hợp trọng điểm: Cam kết thời gian 30 phút vs 2 tiếng
    p_s33 = doc.add_paragraph()
    p_s33.paragraph_format.space_before = Pt(14)
    p_s33.paragraph_format.space_after = Pt(4)
    r_s33 = p_s33.add_run("3.3. Phân tích chi tiết trường hợp trọng điểm: Đồng bộ cam kết thời gian '30 phút' vs '2 tiếng'")
    r_s33.font.name = 'Times New Roman'
    r_s33.font.size = Pt(14)
    r_s33.font.bold = True
    r_s33.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    p_s33_body = doc.add_paragraph()
    p_s33_body.paragraph_format.line_spacing = 1.2
    p_s33_body.paragraph_format.space_after = Pt(6)
    p_s33_body.add_run(
        "Đây là trường hợp sai lệch nội dung điển hình được Lãnh đạo đặc biệt lưu ý trong quá trình rà soát hệ thống. "
        "Cụ thể, tại trang Liên hệ (app/lien-he/page.tsx), khối cam kết dịch vụ từng ghi: 'Phản hồi trong 2 giờ' (hoặc 2 tiếng) "
        "và bước thứ 2 của quy trình ghi 'Nhận báo giá trong 2 giờ làm việc'. Tuy nhiên, cùng thời điểm đó tại trang chủ "
        "và biểu mẫu báo giá nhanh lại cam kết 'Xác nhận trong 30 phút', còn màn hình cảm ơn của Cổng báo giá lại ghi "
        "'Liên hệ trong vòng 15 phút'. Sự sai lệch này gây ra hệ quả nghiêm trọng:\n"
        "1. Khách hàng B2B không biết sau bao lâu họ sẽ được nhân viên TPS1 liên hệ lại (15 phút, 30 phút, 2 tiếng hay 24 tiếng).\n"
        "2. Con số '2 tiếng' tạo cảm giác phản hồi chậm chạp trong môi trường phục vụ bếp ăn vốn yêu cầu tính khẩn trương cao độ.\n"
        "3. Ngược lại, cam kết 'báo giá sỉ xong trong 15 phút' là không khả thi với thực tế vì một bảng báo giá B2B gồm hàng chục mặt hàng tươi sống, "
        "cần kiểm tra tồn kho kho lạnh, tính toán cự ly vận chuyển xe đông lạnh và áp biểu chiết khấu theo sản lượng.\n\n"
        "GIẢI PHÁP ĐỒNG BỘ ĐÃ ÁP DỤNG:\n"
        "Hệ thống đã chuẩn hóa toàn bộ thành một công thức cam kết vận hành kép duy nhất, xuất hiện nhất quán trên toàn bộ các trang:\n"
        "• Mốc 1 — Tiếp nhận & Xác nhận nhu cầu trong 30 phút: Đội ngũ kinh doanh liên hệ trực tiếp với khách hàng để xác nhận danh mục cần mua, số lượng dự kiến và giờ giao ca bếp.\n"
        "• Mốc 2 — Hoàn thành gửi bảng báo giá chính thức trong vòng 24 giờ: Bộ phận điều phối hoàn thiện bảng giá chi tiết có giá sỉ chính xác gửi qua Zalo/Email cho khách hàng.\n"
        "Toàn bộ các vị trí từng ghi '2 giờ', '2 tiếng' hoặc '15 phút' đã được loại bỏ hoàn toàn, trả lại sự chính xác và nhất quán 100% cho thương hiệu."
    )

    # ==================== PHẦN 4: QUY TRÌNH TIẾP NHẬN & CHỈ THỊ THỰC THI CHO AI ====================
    doc.add_page_break()

    p_s4 = doc.add_paragraph()
    p_s4.paragraph_format.space_before = Pt(12)
    p_s4.paragraph_format.space_after = Pt(6)
    r_s4 = p_s4.add_run("4. QUY TRÌNH TIẾP NHẬN & CHỈ THỊ THỰC THI CHUẨN DÀNH CHO AI KẾ THỪA")
    r_s4.font.name = 'Times New Roman'
    r_s4.font.size = Pt(15)
    r_s4.font.bold = True
    r_s4.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    p_s41 = doc.add_paragraph()
    p_s41.paragraph_format.space_before = Pt(6)
    p_s41.paragraph_format.space_after = Pt(4)
    r_s41 = p_s41.add_run("4.1. Giao thức 3 bước thực thi dành cho AI (AI Execution Protocol)")
    r_s41.font.name = 'Times New Roman'
    r_s41.font.size = Pt(14)
    r_s41.font.bold = True
    r_s41.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    p_s41_body = doc.add_paragraph()
    p_s41_body.paragraph_format.line_spacing = 1.2
    p_s41_body.paragraph_format.space_after = Pt(8)
    p_s41_body.add_run(
        "Khi Lãnh đạo bàn giao tệp tài liệu này cho bất kỳ hệ thống AI nào (ChatGPT, Claude, Cursor, Copilot, DeepSeek...), "
        "AI tiếp nhận được yêu cầu thực thi chuẩn xác theo quy trình kỹ thuật 3 bước sau mà không cần hỏi lại người dùng:"
    )

    proto_steps = [
        ("Bước 1 — Định vị tệp nguồn qua Bảng Master Map (Mục 1.2):", " Xác định chính xác tệp tin đích cần chỉnh sửa, không tự ý tạo thêm file mới hoặc can thiệp sai phân hệ."),
        ("Bước 2 — Tra cứu Bảng Đặc Tả Kỹ Thuật (Phần 2 & Phần 3):", " Đọc kỹ cột 'Đặc tả kỹ thuật chuẩn hóa' để lấy chính xác tham số CSS, thuộc tính HTML, text hiển thị; đồng thời tuân thủ tuyệt đối cột 'Quy tắc bất biến' để không làm hỏng các quy chuẩn đã nghiệm thu."),
        ("Bước 3 — Đối soát tiêu chí nghiệm thu (Acceptance Criteria):", " Kiểm tra kết quả hiển thị trên trình duyệt (bao gồm cả Desktop và Mobile) theo đúng tiêu chí tại cột 5 trước khi hoàn tất bàn giao.")
    ]
    for p_title, p_desc in proto_steps:
        p_pr = doc.add_paragraph()
        p_pr.paragraph_format.line_spacing = 1.15
        p_pr.paragraph_format.space_after = Pt(3)
        p_pr.paragraph_format.left_indent = Inches(0.2)
        r_pt = p_pr.add_run(f"• {p_title}")
        r_pt.font.name = 'Times New Roman'
        r_pt.font.size = Pt(12.5)
        r_pt.font.bold = True
        r_pt.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)
        r_pd = p_pr.add_run(p_desc)
        r_pd.font.name = 'Times New Roman'
        r_pd.font.size = Pt(12.5)

    p_s42 = doc.add_paragraph()
    p_s42.paragraph_format.space_before = Pt(12)
    p_s42.paragraph_format.space_after = Pt(4)
    r_s42 = p_s42.add_run("4.2. Mẫu chỉ thị bàn giao nhanh dành cho Lãnh đạo (Quick Prompt Template):")
    r_s42.font.name = 'Times New Roman'
    r_s42.font.size = Pt(14)
    r_s42.font.bold = True
    r_s42.font.color.rgb = RGBColor(0x13, 0x31, 0x27)

    # Prompt Template Table
    t_prompt = doc.add_table(rows=1, cols=1)
    t_prompt.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_prompt.autofit = False
    prompt_cell = t_prompt.rows[0].cells[0]
    prompt_cell.width = Inches(6.8)
    set_cell_background(prompt_cell, "F0FDF4")
    set_cell_margins(prompt_cell, top=120, bottom=120, left=140, right=140)

    tcPr_p = prompt_cell._tc.get_or_add_tcPr()
    borders_p = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="6" w:space="0" w:color="0F6F4B"/>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="0F6F4B"/>'
        f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="0F6F4B"/>'
        f'<w:right w:val="single" w:sz="6" w:space="0" w:color="0F6F4B"/>'
        f'</w:tcBorders>'
    )
    tcPr_p.append(borders_p)

    p_ptxt = prompt_cell.paragraphs[0]
    p_ptxt.paragraph_format.line_spacing = 1.2
    p_ptxt.paragraph_format.space_after = Pt(2)

    r_p_h = p_ptxt.add_run("MẪU LỆNH SẾP GỬI CHO AI KÈM FILE NÀY:\n")
    r_p_h.font.name = 'Times New Roman'
    r_p_h.font.size = Pt(12.5)
    r_p_h.font.bold = True
    r_p_h.font.color.rgb = RGBColor(0x0F, 0x6F, 0x4B)

    r_p_b = p_ptxt.add_run(
        "\"Đây là Báo cáo kỹ thuật và Hồ sơ đặc tả giao diện hệ thống của website TPS1 (thucphamsomot.vn). "
        "Hãy đọc kỹ Bảng chỉ mục tệp nguồn (Mục 1.2), các Bảng đặc tả kỹ thuật 5 cột tại Phần 2 và Bảng chuẩn hóa nội dung tại Phần 3. "
        "Yêu cầu bạn: (1) Xác định đúng tệp đích cần chỉnh sửa theo bảng; (2) Thực hiện chính xác các thông số CSS/HTML/Text chuẩn hóa; "
        "(3) Tuyệt đối tuân thủ các 'Quy tắc bất biến' ghi trong bảng (không đổi route /nganh-hang, không dùng hash #rfq-form, "
        "bảo toàn cam kết 30 phút - 24 giờ, và giữ nhãn 'Gửi yêu cầu báo giá'). Hãy tiến hành kiểm tra mã nguồn và cập nhật theo đúng tài liệu này.\""
    )
    r_p_b.font.name = 'Times New Roman'
    r_p_b.font.size = Pt(11.5)
    r_p_b.font.italic = True
    r_p_b.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    # Lưu tệp hoàn chỉnh
    out_file = "BAO_CAO_RA_SOAT_VA_SUA_LOI_BUTTON_WEBSITE_TPS1.docx"
    alt_file = "BAO_CAO_RA_SOAT_VA_SUA_LOI_BUTTON_WEBSITE_TPS1_BAN_GIAO.docx"
    try:
        doc.save(out_file)
        print(f"Report successfully generated and saved to primary: {out_file}")
    except PermissionError:
        doc.save(alt_file)
        print(f"Primary file locked by another process. Successfully saved to fallback: {alt_file}")

if __name__ == "__main__":
    build_full_report()
