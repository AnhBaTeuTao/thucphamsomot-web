import { NextRequest, NextResponse } from 'next/server';
import { getSkuPage, isSkuCatalogConfigured } from '@/lib/sku-catalog';

export type { SkuProduct } from '@/lib/sku-catalog';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || '';
  const q = (searchParams.get('q') || '').trim();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);

  try {
    const data = await getSkuPage({ group: category, q, page });
    return NextResponse.json(data, {
      headers: isSkuCatalogConfigured()
        ? { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' }
        : { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    console.error('[sku-products] Error:', err);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 503 });
  }
}
