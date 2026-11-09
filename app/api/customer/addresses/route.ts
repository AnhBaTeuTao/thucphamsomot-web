import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveCustomerApiAuth } from "@/lib/customer-api-auth";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" };
const schema = z.object({
  label: z.string().trim().min(2).max(80), address: z.string().trim().min(5).max(500),
  contactName: z.string().trim().min(2).max(120), contactPhone: z.string().trim().min(8).max(20),
  isDefault: z.boolean().optional().default(false),
});
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: cors });
const addressFields = "id, label, address, contact_name, contact_phone, is_default";

export async function GET(req: NextRequest) {
  const auth = await resolveCustomerApiAuth(req);
  if (!auth) return json({ ok: false, error: "Phiên đăng nhập đã hết hạn" }, 401);
  const { data, error } = await auth.supabase.from("customer_addresses")
    .select(addressFields).eq("customer_id", auth.customerId).eq("is_active", true)
    .order("is_default", { ascending: false }).order("created_at", { ascending: true });
  if (error) return json({ ok: false, error: "Không tải được sổ địa chỉ" }, 500);
  return json({ ok: true, addresses: (data || []).map((item) => ({
    id: item.id, label: item.label, address: item.address,
    contactName: item.contact_name || "", contactPhone: item.contact_phone || "",
    isDefault: Boolean(item.is_default),
  })) });
}

export async function POST(req: NextRequest) {
  const auth = await resolveCustomerApiAuth(req);
  if (!auth) return json({ ok: false, error: "Phiên đăng nhập đã hết hạn" }, 401);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ ok: false, error: parsed.error.issues[0]?.message || "Địa chỉ chưa hợp lệ" }, 400);
  const { count, error: countError } = await auth.supabase.from("customer_addresses")
    .select("id", { count: "exact", head: true }).eq("customer_id", auth.customerId).eq("is_active", true);
  if (countError) return json({ ok: false, error: "Không kiểm tra được sổ địa chỉ" }, 500);
  if ((count || 0) >= 20) return json({ ok: false, error: "Mỗi tài khoản lưu tối đa 20 địa chỉ" }, 400);
  const makeDefault = parsed.data.isDefault || count === 0;
  const { data, error } = await auth.supabase.from("customer_addresses").insert({
    customer_id: auth.customerId, label: parsed.data.label, address: parsed.data.address,
    contact_name: parsed.data.contactName, contact_phone: parsed.data.contactPhone,
    is_default: false, is_active: true,
  }).select("id, label, address, contact_name, contact_phone, is_default, is_active").single();
  if (error || !data) return json({ ok: false, error: "Không thêm được địa chỉ" }, 500);
  if (makeDefault) {
    const { error: defaultError } = await auth.supabase.rpc("customer_set_default_address", { p_customer_id: auth.customerId, p_address_id: data.id });
    if (defaultError) {
      await auth.supabase.from("customer_addresses").delete().eq("id", data.id).eq("customer_id", auth.customerId);
      return json({ ok: false, error: "Không đặt được địa chỉ mặc định" }, 500);
    }
    data.is_default = true;
  }
  return json({ ok: true, address: data }, 201);
}

export async function PATCH(req: NextRequest) {
  const auth = await resolveCustomerApiAuth(req);
  if (!auth) return json({ ok: false, error: "Phiên đăng nhập đã hết hạn" }, 401);
  const parsed = z.object({ id: z.uuid(), isDefault: z.literal(true) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ ok: false, error: "Địa chỉ chưa hợp lệ" }, 400);
  const { error } = await auth.supabase.rpc("customer_set_default_address", {
    p_customer_id: auth.customerId, p_address_id: parsed.data.id,
  });
  return error ? json({ ok: false, error: "Không đặt được địa chỉ mặc định" }, 400) : json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const auth = await resolveCustomerApiAuth(req);
  if (!auth) return json({ ok: false, error: "Phiên đăng nhập đã hết hạn" }, 401);
  const id = req.nextUrl.searchParams.get("id");
  if (!id || !z.uuid().safeParse(id).success) return json({ ok: false, error: "Địa chỉ chưa hợp lệ" }, 400);
  const { data: existing, error: readError } = await auth.supabase.from("customer_addresses")
    .select("id, is_default").eq("id", id).eq("customer_id", auth.customerId).eq("is_active", true).maybeSingle();
  if (readError) return json({ ok: false, error: "Không xóa được địa chỉ" }, 500);
  if (!existing) return json({ ok: false, error: "Không tìm thấy địa chỉ" }, 404);
  const { error } = await auth.supabase.from("customer_addresses")
    .update({ is_active: false, is_default: false }).eq("id", id).eq("customer_id", auth.customerId);
  if (error) return json({ ok: false, error: "Không xóa được địa chỉ" }, 500);
  if (existing.is_default) {
    const { data: next } = await auth.supabase.from("customer_addresses")
      .select("id").eq("customer_id", auth.customerId).eq("is_active", true)
      .order("created_at", { ascending: true }).limit(1).maybeSingle();
    if (next) await auth.supabase.rpc("customer_set_default_address", {
      p_customer_id: auth.customerId, p_address_id: next.id,
    });
  }
  return json({ ok: true });
}

export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: cors }); }
