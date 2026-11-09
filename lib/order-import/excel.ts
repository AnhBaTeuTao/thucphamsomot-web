import * as XLSX from 'xlsx';
import type { ExtractedOrderLine } from './types';

export type ExcelColumn = 'sku' | 'name' | 'quantity' | 'unit' | 'note';
export type ExcelMapping = { sheet: string; headerRow: number; columns: Partial<Record<ExcelColumn, number>> };
export type ExcelSheetPreview = {
  name: string;
  rows: Array<{ row: number; cells: string[] }>;
  detectedMapping: ExcelMapping | null;
};

const aliases: Record<ExcelColumn, string[]> = {
  sku: ['ma hang', 'ma san pham', 'ma sp', 'sku', 'product code', 'item code', '商品编码', '商品编号', '货号', '编码'],
  name: ['ten hoac ma hang', 'ten hang', 'ten san pham', 'ten sp', 'san pham', 'mat hang', 'product', 'product name', 'item', 'item name', 'description', '品名', '商品名称', '产品名称', '商品', '名称'],
  quantity: ['so luong', 'sl', 'qty', 'quantity', 'order quantity', '数量', '订购数量', '采购数量'],
  unit: ['don vi', 'dvt', 'unit', 'uom', 'unit of measure', '单位', '计量单位'],
  note: ['ghi chu', 'note', 'notes', 'remark', 'remarks', '备 注', '备注', '说明'],
};

function normalized(value: unknown) {
  return String(value ?? '').normalize('NFKC').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/đ|Đ/g, 'd')
    .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}
function text(value: unknown) { return String(value ?? '').trim(); }
function columnFor(value: unknown): ExcelColumn | null {
  const key = normalized(value);
  if (!key) return null;
  for (const [column, labels] of Object.entries(aliases) as [ExcelColumn, string[]][]) {
    if (labels.some((label) => normalized(label) === key)) return column;
  }
  return null;
}

export function parseExcelNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const cleaned = text(value).replace(/\s/g, '').replace(/[^\d.,+-]/g, '');
  if (!cleaned || !/\d/.test(cleaned)) return null;
  const comma = cleaned.lastIndexOf(',');
  const dot = cleaned.lastIndexOf('.');
  let decimal = cleaned;
  if (comma >= 0 && dot >= 0) {
    const separator = comma > dot ? ',' : '.';
    decimal = cleaned.replace(separator === ',' ? /\./g : /,/g, '').replace(separator, '.');
  } else if (comma >= 0) decimal = cleaned.replace(',', '.');
  const parsed = Number(decimal);
  return Number.isFinite(parsed) ? parsed : null;
}

export function readExcelWorkbook(bytes: Buffer): XLSX.WorkBook {
  if (bytes.length > 10 * 1024 * 1024) throw new Error('File Excel vượt giới hạn 10 MB');
  const wb = XLSX.read(bytes, { type: 'buffer', sheetRows: 1000, cellDates: true });
  if (!wb.SheetNames.length) throw new Error('File Excel không có sheet');
  return wb;
}
function sheetRows(sheet: XLSX.WorkSheet): Array<{ row: number; cells: unknown[] }> {
  const start = sheet['!ref'] ? XLSX.utils.decode_range(sheet['!ref']).s.r : 0;
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null, raw: true });
  return rows.map((cells, index) => ({ row: start + index + 1, cells }));
}
function detectMapping(name: string, rows: ReturnType<typeof sheetRows>): ExcelMapping | null {
  let best: { score: number; mapping: ExcelMapping } | null = null;
  for (const entry of rows.slice(0, 100)) {
    const columns: ExcelMapping['columns'] = {};
    for (let index = 0; index < Math.min(entry.cells.length, 30); index++) {
      const column = columnFor(entry.cells[index]);
      if (column && columns[column] == null) columns[column] = index;
    }
    if (columns.quantity == null || (columns.name == null && columns.sku == null)) continue;
    const next = rows.filter((row) => row.row > entry.row).slice(0, 8);
    const dataRows = next.filter((row) => parseExcelNumber(row.cells[columns.quantity!]) != null).length;
    const score = (columns.sku == null ? 0 : 2) + (columns.name == null ? 0 : 2)
      + (columns.unit == null ? 0 : 1) + (columns.note == null ? 0 : 1) + dataRows * 2;
    if (dataRows && (!best || score > best.score)) best = { score, mapping: { sheet: name, headerRow: entry.row, columns } };
  }
  return best?.mapping || null;
}

export function inspectExcelWorkbook(wb: XLSX.WorkBook): { sheets: ExcelSheetPreview[]; mapping: ExcelMapping | null } {
  const sheets = wb.SheetNames.slice(0, 20).map((name) => {
    const rows = sheetRows(wb.Sheets[name]);
    return {
      name,
      rows: rows.slice(0, 100).map((entry) => ({ row: entry.row, cells: entry.cells.slice(0, 20).map((cell) => text(cell).slice(0, 120)) })),
      detectedMapping: detectMapping(name, rows),
    };
  });
  return { sheets, mapping: sheets.find((sheet) => sheet.detectedMapping)?.detectedMapping || null };
}
function isFooter(cells: unknown[], mapping: ExcelMapping) {
  const candidates = [cells[0], cells[mapping.columns.name ?? -1], cells[mapping.columns.sku ?? -1]];
  return candidates.some((candidate) => /^(tong|tong cong|cong|total|subtotal|合计|总计)$/.test(normalized(candidate)));
}

export function parseExcelWorkbook(wb: XLSX.WorkBook, fileName: string, mapping: ExcelMapping): ExtractedOrderLine[] {
  const sheet = wb.Sheets[mapping.sheet];
  if (!sheet) throw new Error('Không tìm thấy sheet đã chọn');
  const { columns } = mapping;
  if (columns.quantity == null || (columns.sku == null && columns.name == null)) throw new Error('Vui lòng chọn cột sản phẩm và số lượng');
  for (const index of Object.values(columns)) {
    if (!Number.isInteger(index) || index! < 0 || index! > 40) throw new Error('Cột Excel không hợp lệ');
  }
  const usedColumns = Object.values(columns).filter((index) => index != null);
  if (new Set(usedColumns).size !== usedColumns.length) throw new Error('Mỗi trường cần chọn một cột riêng');
  if (!Number.isInteger(mapping.headerRow) || mapping.headerRow < 0 || mapping.headerRow > 999) throw new Error('Dòng tiêu đề không hợp lệ');
  const lines: ExtractedOrderLine[] = [];
  for (const entry of sheetRows(sheet)) {
    if (entry.row <= mapping.headerRow) continue;
    const cells = entry.cells;
    if (isFooter(cells, mapping) && lines.length) break;
    if (lines.length && cells.some((cell) => /^(nguoi lap phieu|nguoi giao hang|nguoi nhan hang|prepared by|delivered by|received by|制单人|收货人)$/.test(normalized(cell)))) break;
    if (columnFor(cells[columns.quantity]) === 'quantity') continue;
    const sku = text(cells[columns.sku ?? -1]);
    const name = text(cells[columns.name ?? -1]);
    if (!sku && !name) continue;
    const quantity = parseExcelNumber(cells[columns.quantity]);
    lines.push({ sourceFile: fileName, sourcePage: null, sourceRow: entry.row,
      rawText: [sku, name].filter(Boolean).join(' - '), sku: sku || null, name: name || sku,
      quantity: quantity ?? Number.NaN, unit: text(cells[columns.unit ?? -1]) || null,
      note: text(cells[columns.note ?? -1]) || null, documentPrice: null, confidence: 1 });
    if (lines.length > 300) throw new Error('File Excel có quá 300 dòng hàng');
  }
  return lines;
}

// Document imports use the same deterministic Excel parser.
export function extractOrderLinesFromExcel(bytes: Buffer, fileName: string): ExtractedOrderLine[] {
  const wb = readExcelWorkbook(bytes);
  const mapping = inspectExcelWorkbook(wb).mapping;
  if (!mapping) throw new Error('Không tự nhận diện được cột Excel; hãy dùng trang Đặt hàng Excel để chọn cột');
  return parseExcelWorkbook(wb, fileName, mapping);
}
