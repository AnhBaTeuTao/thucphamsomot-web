import type { NextRequest } from 'next/server';
import { CUSTOMER_SESSION_COOKIE, parseSessionCookieValue } from '@/lib/customer-session';
import { getCustomerSupabaseAdmin } from '@/lib/customer-supabase-server';

export async function resolveExcelCustomerId(req: NextRequest, tokenFromForm?: string) {
  const supabase = getCustomerSupabaseAdmin();
  const websiteSession = parseSessionCookieValue(req.cookies.get(CUSTOMER_SESSION_COOKIE)?.value);
  const token = tokenFromForm || websiteSession?.orderSessionToken || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data } = await supabase.from('customer_sessions').select('customer_id, expires_at')
    .eq('token', token).gt('expires_at', new Date().toISOString()).maybeSingle();
  return data?.customer_id || null;
}
