"use server";

import type { ContactFormState } from "@/lib/contact";
import {
  processContactSubmission,
  type ContactEmailPayload,
} from "@/lib/contact-submission";

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // POST /contact のレート制限は Vercel Firewall（5回/600秒/IP）が担う。
  const sendEmail = async (payload: ContactEmailPayload) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send(payload);
    if (error) throw new Error(error.message);
  };

  return processContactSubmission(formData, process.env, sendEmail);
}
