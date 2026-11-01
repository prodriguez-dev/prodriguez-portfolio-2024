import { NextResponse } from "next/server";
import {
  CONTACT_API_MESSAGES,
  CONTACT_LIMITS,
  isLikelyBot,
  normalizeContactSubmission,
  validateContact,
} from "@/lib/contact-validation";

export const runtime = "nodejs";
export const maxDuration = 10;

const PROVIDER_TIMEOUT_MS = 8000;

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const raw = await request.text().catch(() => "");
  if (raw.length > CONTACT_LIMITS.bodyMaxChars) {
    return errorResponse(CONTACT_API_MESSAGES.tooLarge, 413);
  }

  let parsed: unknown = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return errorResponse(CONTACT_API_MESSAGES.invalid, 400);
  }

  const submission = normalizeContactSubmission(parsed);

  // Bots get a normal-looking success so they have no signal to adapt to.
  if (isLikelyBot(submission)) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateContact(submission);
  if (Object.keys(errors).length > 0) {
    return errorResponse(CONTACT_API_MESSAGES.invalid, 400);
  }

  const { name, email, subject, message } = submission;
  const destination = process.env.CONTACT_EMAIL_TO || "paul@prodriguez.dev";
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set; message not sent.");
    return errorResponse(CONTACT_API_MESSAGES.unavailable, 503);
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_EMAIL_FROM || "Portfolio Contact <onboarding@resend.dev>",
        to: [destination],
        reply_to: email,
        subject: `[Portfolio] ${subject}`,
        text: [`Name: ${name}`, `Email: ${email}`, `Subject: ${subject}`, "", message].join("\n"),
      }),
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[contact] Resend rejected the message: ${response.status} ${detail.slice(0, 500)}`);
      return errorResponse(CONTACT_API_MESSAGES.failed, 502);
    }
  } catch (error) {
    console.error("[contact] Resend request failed:", error instanceof Error ? error.message : error);
    return errorResponse(CONTACT_API_MESSAGES.failed, 502);
  }

  return NextResponse.json({ ok: true });
}
