import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactPayload | null;

  const name = body?.name?.trim() || "";
  const email = body?.email?.trim() || "";
  const subject = body?.subject?.trim() || "";
  const message = body?.message?.trim() || "";

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  if (!subject) {
    return NextResponse.json({ error: "Subject is required." }, { status: 400 });
  }

  if (message.length < 10) {
    return NextResponse.json({ error: "Message must be at least 10 characters." }, { status: 400 });
  }

  const destination = process.env.CONTACT_EMAIL_TO || "paul@prodriguez.dev";
  const provider = process.env.RESEND_API_KEY;

  if (!provider) {
    return NextResponse.json(
      {
        error:
          "Contact form is not configured yet. Add RESEND_API_KEY and CONTACT_EMAIL_TO to enable delivery.",
      },
      { status: 503 },
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_EMAIL_FROM || "Portfolio Contact <onboarding@resend.dev>",
      to: [destination],
      reply_to: email,
      subject: `[Portfolio] ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    return NextResponse.json(
      { error: errorText || "Email provider rejected the message." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
