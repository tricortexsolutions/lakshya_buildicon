import { z } from "zod";

export const enquirySchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  phone: z.string().min(10, "Please enter a valid Indian mobile number."),
  email: z.string().email("Please enter a valid email address.").optional().or(z.literal("")),
  project: z.string().min(1, "Please select a project."),
  contactMethod: z.enum(["Phone", "WhatsApp", "Email"], {
    message: "Please choose a contact method.",
  }),
  message: z.string().max(500, "Message is too long.").optional().or(z.literal("")),
  consent: z.boolean().refine((value) => value, "Consent is required."),
  honeyPot: z.string().optional(),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;

export function buildWhatsAppLink(whatsappNumber: string, values: Partial<EnquiryFormValues>) {
  const text = encodeURIComponent(
    `Hello Lakshya Buildcon, I am ${values.fullName ?? "interested"}.\nProject: ${values.project ?? "General enquiry"}\nPhone: ${values.phone ?? ""}\nEmail: ${values.email ?? ""}\nMessage: ${values.message ?? ""}`,
  );

  return `https://wa.me/${whatsappNumber}?text=${text}`;
}

export function buildMailtoLink(emailAddress: string, values: Partial<EnquiryFormValues>) {
  const subject = encodeURIComponent(`Enquiry from ${values.fullName ?? "a prospective buyer"}`);
  const body = encodeURIComponent(
    `Project: ${values.project ?? "General enquiry"}\nName: ${values.fullName ?? ""}\nPhone: ${values.phone ?? ""}\nPreferred contact: ${values.contactMethod ?? "Phone"}\nMessage: ${values.message ?? ""}`,
  );

  return `mailto:${emailAddress}?subject=${subject}&body=${body}`;
}

export async function submitEnquiry(
  values: EnquiryFormValues,
  provider?: string,
  endpoint?: string,
) {
  if (provider && endpoint) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.fullName,
        phone: values.phone,
        email: values.email,
        project: values.project,
        contactMethod: values.contactMethod,
        message: values.message,
      }),
    });

    return {
      success: response.ok,
      mode: "provider",
      response,
    };
  }

  return {
    success: false,
    mode: "direct",
    url: undefined,
  };
}
