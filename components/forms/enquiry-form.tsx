"use client";

import { useMemo, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { allProjects } from "@/content/projects";
import { siteConfig } from "@/content/site";
import { buildMailtoLink, buildWhatsAppLink, enquirySchema, submitEnquiry } from "@/lib/submitEnquiry";

const projectOptions = allProjects.map((project) => ({
  label: project.name,
  value: project.name,
}));

export function EnquiryForm() {
  const [values, setValues] = useState({
    fullName: "",
    phone: "",
    email: "",
    project: "",
    contactMethod: "Phone",
    message: "",
    consent: false,
    honeyPot: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const providerEnabled = Boolean(siteConfig.form_delivery.provider && siteConfig.form_delivery.public_key_or_endpoint);
  const whatsappNumber = siteConfig.company.whatsapp || "";
  const contactEmail = siteConfig.company.email || "";

  const submitAction = useMemo(() => {
    if (!providerEnabled) {
      if (whatsappNumber) return "whatsapp";
      if (contactEmail) return "mailto";
      return "disabled";
    }
    return "provider";
  }, [contactEmail, providerEnabled, whatsappNumber]);

  const handleChange = (field: string, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const result = enquirySchema.safeParse({
      ...values,
      consent: Boolean(values.consent),
      honeyPot: values.honeyPot,
    });

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() || "form";
        nextErrors[key] = issue.message;
      });
      setErrors(nextErrors);
      return null;
    }

    return result.data;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (values.honeyPot) {
      setSubmitState("error");
      setSubmitMessage("Request blocked.");
      return;
    }

    const parsed = validate();
    if (!parsed) return;

    setSubmitState("submitting");
    setSubmitMessage("");

    if (submitAction === "disabled") {
      setSubmitMessage("Enquiry channel not yet connected");
      setSubmitState("error");
      console.warn("No enquiry contact channel configured for Lakshya Buildcon.");
      return;
    }

    if (submitAction === "provider") {
      try {
        const response = await submitEnquiry(
          parsed,
          siteConfig.form_delivery.provider,
          siteConfig.form_delivery.public_key_or_endpoint,
        );

        if (response.success) {
          setSubmitState("success");
          setSubmitMessage("Thank you — your enquiry has been sent successfully.");
          setValues({
            fullName: "",
            phone: "",
            email: "",
            project: "",
            contactMethod: "Phone",
            message: "",
            consent: false,
            honeyPot: "",
          });
          return;
        }

        throw new Error("Request failed");
      } catch {
        setSubmitState("error");
        setSubmitMessage("The enquiry request could not be sent right now. Please try again or contact us directly.");
        return;
      }
    }

    const url = submitAction === "whatsapp"
      ? buildWhatsAppLink(whatsappNumber, parsed)
      : buildMailtoLink(contactEmail, parsed);

    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }

    setSubmitState("success");
    setSubmitMessage(submitAction === "whatsapp" ? "A WhatsApp draft has been prepared." : "A mail draft has been prepared.");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-[#242424]">Full name</label>
          <input
            id="fullName"
            value={values.fullName}
            onChange={(event) => handleChange("fullName", event.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className="w-full rounded-xl border border-[#242424]/15 bg-white p-3 text-[#242424] outline-none focus:border-[#B99A62]"
          />
          {errors.fullName ? <p id="fullName-error" className="mt-2 text-sm text-red-600">{errors.fullName}</p> : null}
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#242424]">Phone</label>
          <input
            id="phone"
            value={values.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className="w-full rounded-xl border border-[#242424]/15 bg-white p-3 text-[#242424] outline-none focus:border-[#B99A62]"
          />
          {errors.phone ? <p id="phone-error" className="mt-2 text-sm text-red-600">{errors.phone}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#242424]">Email (optional)</label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => handleChange("email", event.target.value)}
            className="w-full rounded-xl border border-[#242424]/15 bg-white p-3 text-[#242424] outline-none focus:border-[#B99A62]"
          />
        </div>

        <div>
          <label htmlFor="project" className="mb-2 block text-sm font-medium text-[#242424]">Interested project</label>
          <select
            id="project"
            value={values.project}
            onChange={(event) => handleChange("project", event.target.value)}
            className="w-full rounded-xl border border-[#242424]/15 bg-white p-3 text-[#242424] outline-none focus:border-[#B99A62]"
          >
            <option value="">Select a project</option>
            {projectOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.project ? <p className="mt-2 text-sm text-red-600">{errors.project}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="contactMethod" className="mb-2 block text-sm font-medium text-[#242424]">Preferred contact method</label>
          <select
            id="contactMethod"
            value={values.contactMethod}
            onChange={(event) => handleChange("contactMethod", event.target.value)}
            className="w-full rounded-xl border border-[#242424]/15 bg-white p-3 text-[#242424] outline-none focus:border-[#B99A62]"
          >
            <option value="Phone">Phone</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Email">Email</option>
          </select>
        </div>

        <div className="hidden">
          <label htmlFor="honeyPot" className="mb-2 block text-sm font-medium text-[#242424]">Leave empty</label>
          <input
            id="honeyPot"
            value={values.honeyPot}
            onChange={(event) => handleChange("honeyPot", event.target.value)}
            className="w-full rounded-xl border border-[#242424]/15 bg-white p-3 text-[#242424]"
            autoComplete="off"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#242424]">Message</label>
        <textarea
          id="message"
          rows={4}
          value={values.message}
          onChange={(event) => handleChange("message", event.target.value)}
          className="w-full rounded-xl border border-[#242424]/15 bg-white p-3 text-[#242424] outline-none focus:border-[#B99A62]"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-[#242424]">
        <input type="checkbox" checked={values.consent} onChange={(event) => handleChange("consent", event.target.checked)} className="mt-1 h-4 w-4 accent-[#B99A62]" />
        <span>I agree to be contacted regarding my enquiry.</span>
      </label>
      {errors.consent ? <p className="text-sm text-red-600">{errors.consent}</p> : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitState === "submitting" || submitAction === "disabled"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#242424] px-6 py-3 text-sm font-medium text-[#F7F5F0] transition hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitState === "submitting" ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Sending</>
          ) : (
            <><span>{submitAction === "disabled" ? "Enquiry unavailable" : "Submit enquiry"}</span><ArrowRight className="h-4 w-4" /></>
          )}
        </button>

        {submitState === "success" ? (
          <div className="inline-flex items-center gap-2 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            {submitMessage}
          </div>
        ) : null}

        {submitState === "error" ? (
          <div className="inline-flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            {submitMessage}
          </div>
        ) : null}
      </div>

      {submitAction === "disabled" ? (
        <p className="rounded-2xl border border-dashed border-[#242424]/20 bg-[#F7F5F0] p-3 text-sm text-[#242424]/70">
          Enquiry channel not yet connected.
        </p>
      ) : null}
    </form>
  );
}
