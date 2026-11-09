import { validateOrderQuantity } from '@/lib/order-quantity';
import { resolveOrderPriceBook } from '@/lib/order-price-book';
import type { ExtractedOrderLine } from './types';
import englishNames from './data/catalog-names-en.json';
import chineseNames from './data/catalog-names-zh-CN.json';
import { certainSkuName, certainUniqueName, uncertainOrderNote } from './confidence';

type SupabaseAdmin = any;
type ProductRow = {
  id: string; sku: string; name: string; unit: string; active: boolean;
  min_order_qty: number | null; order_step: number | null; enforce_order_step: boolean | null;
  quantity_precision: number | null; quantity_adjustment_mode: string | null;
};
export type ExcelProduct = {
  id: string; sku: string; name: string; unit: string; price: number; priceOnRequest: boolean;
  minOrderQty: number; orderStep: number; enforceOrderStep: boolean; quantityPrecision: number; quantityAdjustmentMode: string;
};
export type ExcelPreviewLine = {
  row: number; sourceSheet: string; input: string; sku: string; name: string; unit: string;
  quantity: number | null; requestedQuantity: number | null; note: string;
  status: 'matched' | 'ambiguous' | 'not_found' | 'invalid_quantity' | 'unit_conflict';
  warning?: string; product?: ExcelProduct;
  suggestions?: Array<ExcelProduct & { score: number }>;
};

export function normalizeExcelName(value: unknown) {
  return String(value ?? '').normalize('NFKC').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/đ|Đ/g, 'd')
    .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}
function grams(value: string) {
  const result = new Set<string>();
  const padded = `  ${value} `;
  for (let i = 0; i < padded.length - 2; i++) result.add(padded.slice(i, i + 3));
  return result;
}
function similarity(a: Set<string>, b: Set<string>) {
  if (!a.size || !b.size) return 0;
  let overlap = 0;
  for (const gram of a) if (b.has(gram)) overlap++;
  return 2 * overlap / (a.size + b.size);
}
function namesFor(product: ProductRow) {
  return [product.name,
    (englishNames as Record<string, string>)[product.name],
    (chineseNames as Record<string, string>)[product.name],
  ].filter(Boolean).map(normalizeExcelName);
}
async function loadCatalog(supabase: SupabaseAdmin): Promise<ProductRow[]> {
  const rows: ProductRow[] = [];
  for (let offset = 0; offset < 10000; offset += 1000) {
    const { data, error } = await supabase.from('products')
      .select('id, sku, name, unit, active, min_order_qty, order_step, enforce_order_step, quantity_precision, quantity_adjustment_mode')
      .eq('active', true).order('id').range(offset, offset + 999);
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < 1000) return rows;
  }
  throw new Error('Danh mục sản phẩm vượt giới hạn đọc Excel');
}
function productFor(row: ProductRow, price = 0): ExcelProduct {
  return {
    id: row.id, sku: row.sku, name: row.name, unit: row.unit || 'Kg',
    price, priceOnRequest: price <= 0, minOrderQty: Number(row.min_order_qty) || 0,
    orderStep: Number(row.order_step) || 0, enforceOrderStep: Boolean(row.enforce_order_step),
    quantityPrecision: Number(row.quantity_precision ?? 3), quantityAdjustmentMode: row.quantity_adjustment_mode || 'reject',
  };
}

export async function previewCustomerExcel(supabase: SupabaseAdmin, customerId: string, sheet: string, lines: ExtractedOrderLine[]) {
  const products = await loadCatalog(supabase);
  const byId = new Map(products.map((p) => [p.id, p]));
  const bySku = new Map(products.filter((p) => p.sku).map((p) => [String(p.sku).trim().toLowerCase(), p]));
  const byName = new Map<string, ProductRow[]>();
  const searchable = products.map((product) => {
    const names = namesFor(product);
    for (const name of names) byName.set(name, [...(byName.get(name) || []), product]);
    return { product, grams: names.map(grams) };
  });
  const { data: aliasRows } = await supabase.from('product_aliases')
    .select('product_id, alias_normalized, verified_by')
    .or(`customer_id.is.null,customer_id.eq.${customerId}`);
  for (const alias of aliasRows || []) {
    if (!alias.verified_by) continue;
    const product = byId.get(alias.product_id);
    if (!product) continue;
    const key = normalizeExcelName(alias.alias_normalized);
    byName.set(key, [...(byName.get(key) || []), product]);
  }
  type Preliminary = { line: ExtractedOrderLine; product?: ProductRow; candidates: Array<{ product: ProductRow; score: number }>; warning?: string };
  const preliminaries: Preliminary[] = lines.map((line) => {
    const sku = String(line.sku || line.name || '').trim().toLowerCase();
    const name = normalizeExcelName(line.name);
    const codeMatch = sku ? bySku.get(sku) : undefined;
    const exactNames = [...new Map((byName.get(name) || []).map((p) => [p.id, p])).values()];
    const uncertainNote = uncertainOrderNote(line.note);
    if (codeMatch) {
      if (certainSkuName(codeMatch.sku, line.name, namesFor(codeMatch), normalizeExcelName)) {
        return uncertainNote
          ? { line, candidates: [{ product: codeMatch, score: 1 }], warning: 'Ghi chú yêu cầu kiểm tra lại; vui lòng chọn sản phẩm' }
          : { line, product: codeMatch, candidates: [] };
      }
      return { line, candidates: [{ product: codeMatch, score: 1 }, ...exactNames.filter((p) => p.id !== codeMatch.id).map((product) => ({ product, score: 0.95 }))], warning: 'Mã và tên hàng không khớp; vui lòng chọn lại' };
    }
    if (certainUniqueName(exactNames.length, line.note)) return { line, product: exactNames[0], candidates: [] };
    if (exactNames.length === 1) return { line, candidates: [{ product: exactNames[0], score: 1 }], warning: 'Ghi chú yêu cầu kiểm tra lại; vui lòng chọn sản phẩm' };
    if (exactNames.length > 1) return { line, candidates: exactNames.slice(0, 5).map((product) => ({ product, score: 1 })) };
    const inputGrams = grams(name || normalizeExcelName(line.sku));
    const candidates = searchable.map(({ product, grams: candidateGrams }) => ({
      product, score: Math.max(...candidateGrams.map((candidate) => similarity(inputGrams, candidate))),
    })).filter((candidate) => candidate.score >= 0.28)
      .sort((a, b) => b.score - a.score).slice(0, 5);
    return { line, candidates };
  });

  const matchedIds = [...new Set(preliminaries.map((entry) => entry.product?.id).filter(Boolean))] as string[];
  const { data: conversions } = matchedIds.length
    ? await supabase.from('product_unit_conversions')
      .select('product_id, input_unit, input_unit_normalized, factor_to_order_unit')
      .eq('is_active', true).in('product_id', matchedIds)
    : { data: [] as any[] };
  const validations = preliminaries.map((entry) => entry.product
    ? validateOrderQuantity(entry.product, Number(entry.line.quantity), entry.line.unit || entry.product.unit,
      (conversions || []).filter((conversion: any) => conversion.product_id === entry.product!.id))
    : null);
  const priceInputs = preliminaries.flatMap((entry, index) => {
    const validation = validations[index];
    return entry.product && validation?.ok && validation.quantity != null
      ? [{ productId: entry.product.id, quantity: validation.quantity }] : [];
  });
  const priced = priceInputs.length ? await resolveOrderPriceBook(supabase, customerId, priceInputs) : null;
  const priceById = new Map((priced?.resolved || []).map((row) => [row.productId, row.price]));
  const results: ExcelPreviewLine[] = preliminaries.map((entry, index) => {
    const { line, product, candidates } = entry;
    const quantity = Number.isFinite(line.quantity) ? line.quantity : null;
    const base = { row: line.sourceRow || index + 1, sourceSheet: sheet, input: line.rawText || line.name,
      sku: line.sku || '', name: line.name, unit: line.unit || '', quantity,
      requestedQuantity: quantity, note: line.note || '' };
    if (quantity == null || quantity <= 0) return { ...base, status: 'invalid_quantity', warning: 'Số lượng phải lớn hơn 0' };
    if (product) {
      const validation = validations[index]!;
      if (!validation.ok || validation.quantity == null) return {
        ...base, status: validation.code === 'UNIT_CONFLICT' ? 'unit_conflict' : 'invalid_quantity',
        warning: validation.message || 'Số lượng hoặc đơn vị không hợp lệ', product: productFor(product),
      };
      return { ...base, quantity: validation.quantity, status: 'matched',
        warning: validation.adjusted ? validation.message : undefined,
        product: productFor(product, priceById.get(product.id) || 0) };
    }
    return { ...base, status: candidates.length ? 'ambiguous' : 'not_found', warning: entry.warning,
      suggestions: candidates.map(({ product: p, score }) => ({ ...productFor(p), score: Math.round(score * 100) / 100 })) };
  });
  return { results, summary: { total: results.length,
    matched: results.filter((r) => r.status === 'matched').length,
    ambiguous: results.filter((r) => r.status === 'ambiguous').length,
    notFound: results.filter((r) => r.status === 'not_found').length,
    invalidQuantity: results.filter((r) => r.status === 'invalid_quantity' || r.status === 'unit_conflict').length } };
}

export type ExcelSelection = { sourceSheet: string; row: number; productId: string; quantity: number; unit: string; note: string };
export async function resolveCustomerExcelSelection(supabase: SupabaseAdmin, customerId: string, selections: ExcelSelection[]) {
  const ids = [...new Set(selections.map((item) => item.productId))];
  const { data: products, error } = await supabase.from('products')
    .select('id, sku, name, unit, active, min_order_qty, order_step, enforce_order_step, quantity_precision, quantity_adjustment_mode')
    .in('id', ids).eq('active', true);
  if (error) throw error;
  const byId = new Map<string, ProductRow>((products || []).map((product: ProductRow) => [product.id, product]));
  const { data: conversions } = await supabase.from('product_unit_conversions')
    .select('product_id, input_unit, input_unit_normalized, factor_to_order_unit')
    .eq('is_active', true).in('product_id', ids);
  const errors: Array<{ row: number; sourceSheet: string; message: string }> = [];
  const valid = selections.flatMap((selection) => {
    const product = byId.get(selection.productId);
    if (!product) { errors.push({ row: selection.row, sourceSheet: selection.sourceSheet, message: 'Sản phẩm không còn bán' }); return []; }
    const check = validateOrderQuantity(product, Number(selection.quantity), selection.unit || product.unit,
      (conversions || []).filter((conversion: any) => conversion.product_id === product.id));
    if (!check.ok || check.quantity == null) {
      errors.push({ row: selection.row, sourceSheet: selection.sourceSheet, message: check.message || 'Số lượng không hợp lệ' });
      return [];
    }
    return [{ selection, product, check }];
  });
  if (errors.length) return { items: [], errors };
  const pricing = await resolveOrderPriceBook(supabase, customerId,
    valid.map(({ product, check }) => ({ productId: product.id, quantity: check.quantity! })));
  if (pricing.errors.length) return { items: [], errors: [{ row: 0, sourceSheet: '', message: pricing.errors.join('; ') }] };
  const priceById = new Map(pricing.resolved.map((row) => [row.productId, row.price]));
  return { errors: [], items: valid.map(({ selection, product, check }) => ({
    ...productFor(product, priceById.get(product.id) || 0), sourceSheet: selection.sourceSheet,
    row: selection.row, quantity: check.quantity!, requestedQuantity: selection.quantity,
    adjusted: Boolean(check.adjusted), adjustmentMessage: check.message || null,
    note: selection.note.slice(0, 500),
  })) };
}
