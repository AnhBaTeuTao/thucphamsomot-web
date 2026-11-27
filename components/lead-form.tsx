"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Send } from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/validation";

type LeadFormProps = {
  mode: "contact" | "quote";
  locale?: "vi" | "en";
};

const FORM_COPY = {
  vi: {
    receivedBadge: "Đã nhận thông tin",
    receivedTitle: "Đã nhận thông tin của bạn.",
    receivedCopy:
      "Đội ngũ sẽ kiểm tra nhu cầu và phản hồi lại theo số điện thoại hoặc email đã cung cấp.",
    pillQuote: "Yêu cầu báo giá",
    pillContact: "Liên hệ tư vấn",
    descQuote:
      "Để lại thông tin nhu cầu, đội ngũ TPS1 sẽ gửi phương án báo giá phù hợp nhất trong vòng 24 giờ.",
    descContact:
      "Để lại thông tin liên hệ, đội ngũ TPS1 sẽ phản hồi và tư vấn nhanh chóng cho Quý khách.",
    nameLabel: "Họ tên",
    phoneLabel: "Số điện thoại",
    companyLabel: "Công ty",
    msgLabelQuote: "Nhu cầu",
    msgLabelContact: "Nội dung liên hệ",
    msgPlaceholderQuote: "Mô tả loại hàng, số lượng, lịch giao, khu vực",
    msgPlaceholderContact: "Nội dung Quý khách cần liên hệ, tư vấn hoặc trao đổi hợp tác...",
    submitting: "Đang gửi...",
    submitQuote: "Gửi yêu cầu báo giá",
    submitContact: "Gửi liên hệ",
  },
  en: {
    receivedBadge: "Request received",
    receivedTitle: "We have received your message.",
    receivedCopy:
      "Our B2B team will review your requirements and get back to you shortly via your phone number or email.",
    pillQuote: "Request a quote",
    pillContact: "Contact consultation",
    descQuote:
      "Share your purchasing needs and our team will prepare a tailored wholesale quotation within 24 hours.",
    descContact:
      "Leave your contact details and our B2B team will respond within 30 minutes to assist your kitchen.",
    nameLabel: "Full name",
    phoneLabel: "Phone / Zalo number",
    companyLabel: "Company or kitchen name",
    msgLabelQuote: "Order requirements",
    msgLabelContact: "Message",
    msgPlaceholderQuote: "Product categories, estimated volume, delivery schedule, location...",
    msgPlaceholderContact: "Tell us how we can support your kitchen or partnership inquiry...",
    submitting: "Sending...",
    submitQuote: "Send quote request",
    submitContact: "Send message",
  },
} as const;

export function LeadForm({ mode, locale = "vi" }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const t = FORM_COPY[locale];
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const res = await fetch(mode === "quote" ? "/api/quote" : "/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      setSubmitted(true);
      reset();
    }
  });

  if (submitted) {
    return (
      <div className="lead-form lead-form--success">
        <div className="lead-form__success-badge">
          <Sparkles size={16} />
          {t.receivedBadge}
        </div>
        <p className="lead-form__success-title">{t.receivedTitle}</p>
        <p className="lead-form__success-copy">{t.receivedCopy}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="lead-form">
      <div className="lead-form__header">
        <div className="pill">{mode === "quote" ? t.pillQuote : t.pillContact}</div>
        <p>{mode === "quote" ? t.descQuote : t.descContact}</p>
      </div>

      <div className="lead-form__grid">
        <Field label={t.nameLabel} error={errors.name?.message} {...register("name")} />
        <Field label={t.phoneLabel} error={errors.phone?.message} {...register("phone")} />
      </div>

      <Field label={t.companyLabel} error={errors.company?.message} {...register("company")} />

      <div>
        <label className="lead-form__label">
          {mode === "quote" ? t.msgLabelQuote : t.msgLabelContact}
        </label>
        <textarea
          {...register("message")}
          rows={5}
          className="lead-form__textarea"
          placeholder={mode === "quote" ? t.msgPlaceholderQuote : t.msgPlaceholderContact}
        />
        {errors.message?.message ? <p className="lead-form__error">{errors.message.message}</p> : null}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary lead-form__button">
        {isSubmitting ? t.submitting : mode === "quote" ? t.submitQuote : t.submitContact}
        <Send size={18} />
      </button>
    </form>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

function Field({ label, error, ...props }: FieldProps) {
  return (
    <div>
      <label className="lead-form__label">{label}</label>
      <input {...props} className="lead-form__input" />
      {error ? <p className="lead-form__error">{error}</p> : null}
    </div>
  );
}
