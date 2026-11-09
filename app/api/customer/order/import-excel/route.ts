import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import * as XLSX from 'xlsx';
import { getCustomerSupabaseAdmin } from '@/lib/customer-supabase-server';
import { resolveExcelCustomerId } from '@/lib/order-import/customer-auth';
import { inspectExcelWorkbook, parseExcelWorkbook, readExcelWorkbook, type ExcelMapping } from '@/lib/order-import/excel';
import { previewCustomerExcel } from '@/lib/order-import/customer-excel';

export const runtime = 'nodejs';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };
function json(body: unknown, status = 200) { return NextResponse.json(body, { status, headers: cors }); }
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: cors }); }

export async function GET() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    ['Tên hoặc Mã hàng', 'Số lượng', 'Ghi chú'],
    ['VD: Bắp chuối nguyên cái', 5, ''],
  ]);
  ws['!cols'] = [{ wch: 32 }, { wch: 10 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Dat hang');
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return new NextResponse(buffer, { status: 200, headers: {
    ...cors, 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': 'attachment; filename="mau-dat-hang.xlsx"',
  } });
}

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  const customerId = await resolveExcelCustomerId(req, String(form?.get('token') || ''));
  if (!customerId) return json({ ok: false, code: 'SESSION_EXPIRED', error: 'Vui lòng đăng nhập lại' }, 401);
  if (!(file instanceof File)) return json({ ok: false, code: 'MISSING_FILE', error: 'Thiếu file Excel' }, 400);
  if (!/\.(xlsx|xls)$/i.test(file.name) || file.size > 4 * 1024 * 1024 || !file.size) {
    return json({ ok: false, code: 'INVALID_EXCEL_FILE', error: 'Chỉ nhận file Excel tối đa 4 MB' }, 400);
  }
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const xlsx = bytes.subarray(0, 2).toString() === 'PK';
    const xls = bytes.subarray(0, 8).toString('hex') === 'd0cf11e0a1b11ae1';
    if (!xlsx && !xls) return json({ ok: false, code: 'INVALID_EXCEL_FILE', error: 'File không đúng định dạng Excel' }, 400);
    const wb = readExcelWorkbook(bytes);
    const inspected = inspectExcelWorkbook(wb);
    let mapping = inspected.mapping;
    const requested = form?.get('mapping');
    if (typeof requested === 'string' && requested.trim()) {
      try { mapping = JSON.parse(requested) as ExcelMapping; }
      catch { return json({ ok: false, code: 'INVALID_MAPPING', error: 'Cách chọn cột không hợp lệ' }, 400); }
    }
    const fileHash = crypto.createHash('sha256').update(bytes).digest('hex');
    if (!mapping) return json({ ok: true, needsMapping: true, fileHash, sheets: inspected.sheets, mapping: null, results: [], summary: null });
    const lines = parseExcelWorkbook(wb, file.name, mapping);
    if (!lines.length) return json({ ok: true, needsMapping: true, fileHash, sheets: inspected.sheets, mapping, results: [], summary: null });
    const matched = await previewCustomerExcel(getCustomerSupabaseAdmin(), customerId, mapping.sheet, lines);
    return json({ ok: true, needsMapping: false, fileHash, sheets: inspected.sheets, mapping, ...matched });
  } catch (error) {
    console.error('POST /api/customer/order/import-excel:', error);
    const message = error instanceof Error ? error.message : 'Không đọc được file Excel';
    const badFile = /Excel|sheet|cột|dòng/i.test(message);
    return json({ ok: false, code: badFile ? 'INVALID_EXCEL_FILE' : 'EXCEL_PREVIEW_FAILED',
      error: badFile ? message : 'Không đọc được file Excel, vui lòng thử lại' }, badFile ? 400 : 500);
  }
}
