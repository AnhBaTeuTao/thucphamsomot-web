import { NextRequest, NextResponse } from "next/server";
import { resolveCustomerApiAuth } from "@/lib/customer-api-auth";
import { z } from "zod";
import sharp from "sharp";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: cors });
const mobileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(180),
  taxCode: z.string().trim().max(30),
}).strict();

async function mobileAccount(auth: NonNullable<Awaited<ReturnType<typeof resolveCustomerApiAuth>>>) {
  const { supabase, customerId } = auth;
  const [{ data: profile, error }, { data: request }] = await Promise.all([
    supabase.from("vip_accounts")
      .select("name,company,tax_code,avatar_path,username,username_changed_at")
      .eq("id", customerId).eq("is_active", true).maybeSingle(),
    supabase.from("customer_profile_requests")
      .select("id,company,tax_code,status,requested_at,note")
      .eq("customer_id", customerId).order("requested_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (error || !profile) return null;
  const avatarUrl = profile.avatar_path
    ? (await supabase.storage.from("customer-avatars").createSignedUrl(profile.avatar_path, 3600)).data?.signedUrl || null
    : null;
  return {
    name: profile.name, company: profile.company || "", taxCode: profile.tax_code || "",
    username: profile.username || "", usernameChangedAt: profile.username_changed_at || null,
    avatarUrl, request: request || null,
  };
}

function activeAt(row: any, now: number) {
  if (row?.valid_from && new Date(row.valid_from).getTime() > now) return false;
  if (row?.valid_to && new Date(row.valid_to).getTime() < now) return false;
  return true;
}

export async function GET(req: NextRequest) {
  const auth = await resolveCustomerApiAuth(req);
  if (!auth) return json({ ok: false, error: "Phiên đăng nhập đã hết hạn" }, 401);
  if (req.nextUrl.searchParams.get("mobile") === "1") {
    const account = await mobileAccount(auth);
    return account ? json({ ok: true, account }) : json({ ok: false, error: "Không tải được tài khoản" }, 500);
  }
  const { supabase, customerId } = auth;
  const now = Date.now();
  try {
    const [profileResult, addressesResult, recentResult, totalResult, processingResult, shippingResult, completedResult, requestResult] = await Promise.all([
      supabase.from("vip_accounts")
        .select("id, partner_code, name, phone, company, email, tax_code, address, customer_group, verification_status, is_active")
        .eq("id", customerId).single(),
      supabase.from("customer_addresses")
        .select("id, label, address, contact_name, contact_phone, is_default, is_active, created_at, updated_at")
        .eq("customer_id", customerId).eq("is_active", true)
        .order("is_default", { ascending: false }).order("created_at", { ascending: true }),
      supabase.from("orders")
        .select("id, order_code, status, grand_total, delivery_date, created_at")
        .eq("customer_id", customerId).neq("status", "merged")
        .order("created_at", { ascending: false }).limit(5),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("customer_id", customerId).neq("status", "merged"),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("customer_id", customerId).in("status", ["draft", "pending", "confirmed", "preparing"]),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("customer_id", customerId).eq("status", "shipping"),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("customer_id", customerId).eq("status", "completed"),
      supabase.from("customer_profile_change_requests")
        .select("id, requested_company, requested_tax_code, reason, status, created_at, review_note")
        .eq("customer_id", customerId).order("created_at", { ascending: false }).limit(5),
    ]);
    if (profileResult.error || !profileResult.data) throw profileResult.error || new Error("Không tìm thấy khách hàng");

    const profile = profileResult.data;
    const { data: activeBooks, error: bookError } = await supabase.from("price_books")
      .select("id, name, kind, status, version, valid_from, valid_to, created_at")
      .eq("status", "active");
    if (bookError) throw bookError;
    const books = (activeBooks || []).filter((row: any) => activeAt(row, now));
    const bookMap = new Map(books.map((row: any) => [row.id, row]));
    const [directResult, groupResult] = await Promise.all([
      supabase.from("price_book_customer_assignments")
        .select("price_book_id, priority, valid_from, valid_to, created_at")
        .eq("customer_id", customerId),
      profile.customer_group
        ? supabase.from("price_book_customer_group_assignments")
            .select("price_book_id, priority, valid_from, valid_to, created_at")
            .ilike("group_name", profile.customer_group)
        : Promise.resolve({ data: [], error: null }),
    ]);
    const rank = (rows: any[]) => [...rows]
      .filter((row) => bookMap.has(row.price_book_id) && activeAt(row, now))
      .sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0) || new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    const direct = rank(directResult.data || []);
    const group = rank(groupResult.data || []);
    const general = books.filter((row: any) => row.kind === "general")
      .sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    const selectedBook: any = bookMap.get(direct[0]?.price_book_id) || bookMap.get(group[0]?.price_book_id) || general[0] || null;

    const account = await mobileAccount(auth);
    return json({
      ok: true,
      account,
      profile: {
        id: profile.id, code: profile.partner_code, contactName: profile.name,
        phone: profile.phone || "", company: profile.company || "", email: profile.email || "",
        taxCode: profile.tax_code || "", address: profile.address || "",
        verificationStatus: profile.verification_status || "pending", isActive: Boolean(profile.is_active),
        priceBook: selectedBook ? { id: selectedBook.id, name: selectedBook.name, version: Number(selectedBook.version) || 1 } : null,
      },
      orderSummary: {
        total: totalResult.count || 0, processing: processingResult.count || 0,
        shipping: shippingResult.count || 0, completed: completedResult.count || 0,
      },
      recentOrders: recentResult.data || [],
      addresses: addressesResult.data || [],
      legalChangeRequests: requestResult.error ? [] : requestResult.data || [],
    });
  } catch (error) {
    console.error("GET /api/customer/account error:", error);
    return json({ ok: false, error: "Không tải được thông tin tài khoản" }, 500);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await resolveCustomerApiAuth(req);
  if (!auth) return json({ ok: false, error: "Phiên đăng nhập đã hết hạn" }, 401);
  const parsed = mobileSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ ok: false, error: "Thông tin chưa hợp lệ" }, 400);
  const { name, company, taxCode } = parsed.data;
  const { supabase, customerId } = auth;
  const { data: current, error } = await supabase.from("vip_accounts")
    .select("company,tax_code").eq("id", customerId).eq("is_active", true).maybeSingle();
  if (error || !current) return json({ ok: false, error: "Không tải được tài khoản" }, 500);
  const { error: nameError } = await supabase.from("vip_accounts").update({ name }).eq("id", customerId);
  if (nameError) return json({ ok: false, error: "Không lưu được tên liên hệ" }, 500);
  if (company !== (current.company || "") || taxCode !== (current.tax_code || "")) {
    const { data: pending } = await supabase.from("customer_profile_requests")
      .select("id").eq("customer_id", customerId).eq("status", "pending").maybeSingle();
    const request = pending
      ? await supabase.from("customer_profile_requests")
          .update({ company, tax_code: taxCode, requested_at: new Date().toISOString() }).eq("id", pending.id)
      : await supabase.from("customer_profile_requests")
          .insert({ customer_id: customerId, company, tax_code: taxCode });
    if (request.error) return json({ ok: false, error: "Không gửi được yêu cầu cập nhật" }, 500);
  }
  const account = await mobileAccount(auth);
  return account ? json({ ok: true, account }) : json({ ok: false, error: "Không tải được tài khoản" }, 500);
}

export async function POST(req: NextRequest) {
  const auth = await resolveCustomerApiAuth(req);
  if (!auth) return json({ ok: false, error: "Phiên đăng nhập đã hết hạn" }, 401);
  const file = (await req.formData().catch(() => null))?.get("avatar");
  if (!(file instanceof File) || !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    || file.size === 0 || file.size > 2_097_152) {
    return json({ ok: false, error: "Chọn ảnh JPG, PNG hoặc WebP dưới 2 MB" }, 400);
  }
  let image: Buffer;
  try {
    image = await sharp(Buffer.from(await file.arrayBuffer())).rotate()
      .resize(512, 512, { fit: "cover" }).webp({ quality: 82 }).toBuffer();
  } catch { return json({ ok: false, error: "Ảnh không hợp lệ" }, 400); }
  const { supabase, customerId } = auth;
  const path = `${customerId}/avatar-${Date.now()}.webp`;
  const { error: uploadError } = await supabase.storage.from("customer-avatars")
    .upload(path, image, { contentType: "image/webp", upsert: false });
  if (uploadError) return json({ ok: false, error: "Không lưu được ảnh đại diện" }, 500);
  const { data: previous } = await supabase.from("vip_accounts")
    .select("avatar_path").eq("id", customerId).maybeSingle();
  const { error: updateError } = await supabase.from("vip_accounts")
    .update({ avatar_path: path }).eq("id", customerId);
  if (updateError) {
    await supabase.storage.from("customer-avatars").remove([path]);
    return json({ ok: false, error: "Không lưu được ảnh đại diện" }, 500);
  }
  if (previous?.avatar_path) await supabase.storage.from("customer-avatars").remove([previous.avatar_path]);
  const account = await mobileAccount(auth);
  return account ? json({ ok: true, account }) : json({ ok: false, error: "Không tải được tài khoản" }, 500);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors });
}
