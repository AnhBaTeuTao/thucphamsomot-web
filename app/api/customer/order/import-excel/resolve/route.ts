import { NextRequest, NextResponse } from 'next/server';
import { getCustomerSupabaseAdmin } from '@/lib/customer-supabase-server';
import { resolveExcelCustomerId } from '@/lib/order-import/customer-auth';
import { resolveCustomerExcelSelection, type ExcelSelection } from '@/lib/order-import/customer-excel';

export const runtime = 'nodejs';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };
function json(body: unknown, status = 200) { return NextResponse.json(body, { status, headers: cors }); }
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: cors }); }

export async function POST(req: NextRequest) {
  const customerId = await resolveExcelCustomerId(req);
  if (!customerId) return json({ ok: false, code: 'SESSION_EXPIRED', error: 'Vui lòng đăng nhập lại' }, 401);
  const body = await req.json().catch(() => null);
  const input = body?.items;
  if (!Array.isArray(input) || !input.length || input.length > 300) {
    return json({ ok: false, code: 'INVALID_SELECTION', error: 'Chọn từ 1 đến 300 dòng hàng' }, 400);
  }
  const items: ExcelSelection[] = [];
  const keys = new Set<string>();
  for (const value of input) {
    const item = {
      sourceSheet: String(value?.sourceSheet || '').slice(0, 100), row: Number(value?.row),
      productId: String(value?.productId || ''), quantity: Number(value?.quantity),
      unit: String(value?.unit || '').trim().slice(0, 50), note: String(value?.note || '').slice(0, 500),
      unlisted: value?.unlisted === true, name: String(value?.name || '').trim().slice(0, 200),
    };
    const key = `${item.sourceSheet}:${item.row}`;
    if ((!item.unlisted && !item.productId) || (item.unlisted && (item.productId || !item.name || !item.unit))
      || !Number.isInteger(item.row) || item.row < 1 || !Number.isFinite(item.quantity)
      || item.quantity <= 0 || keys.has(key)) {
      return json({ ok: false, code: 'INVALID_SELECTION', error: 'Dòng hàng đã chọn không hợp lệ hoặc bị trùng' }, 400);
    }
    keys.add(key);
    items.push(item);
  }
  try {
    const result = await resolveCustomerExcelSelection(getCustomerSupabaseAdmin(), customerId, items);
    if (result.errors.length) return json({ ok: false, code: 'IMPORT_LINES_INVALID', error: 'Có dòng hàng cần sửa trước khi thêm vào giỏ', errors: result.errors }, 422);
    return json({ ok: true, items: result.items });
  } catch (error) {
    console.error('POST /api/customer/order/import-excel/resolve:', error);
    return json({ ok: false, code: 'EXCEL_RESOLVE_FAILED', error: 'Không kiểm tra được dòng hàng, vui lòng thử lại' }, 500);
  }
}
