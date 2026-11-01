// Shared by ContactForm (client) and /api/contact (server). Keep this module
// free of imports so it stays cheap to bundle on both sides.

export const CONTACT_SUBJECTS = [
  "General Inquiry",
  "AI Workflow Automation",
  "Solutions Architecture Engagement",
  "Technical Discovery / Demo Support",
  "Other",
] as const;

export const CONTACT_LIMITS = {
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 4000,
  /** Submissions faster than this after the form mounted are treated as bots. */
  minFillMs: 3000,
  /** Upper bound on the raw request body (characters) accepted by the API route. */
  bodyMaxChars: 16 * 1024,
} as const;

export type ContactField = "name" | "email" | "subject" | "message";
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactSubmission = ContactValues & {
  /** Honeypot. Real users never see or fill it. */
  company: string;
  /** Milliseconds between form mount and submit, measured on the client. */
  elapsedMs: number | null;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Collapse CR/LF so a value can never span lines in an email subject or header. */
export function stripLineBreaks(value: string): string {
  return value.replace(/[\r\n]+/g, " ");
}

/** Coerce untrusted JSON into a typed submission. Never throws. */
export function normalizeContactSubmission(input: unknown): ContactSubmission {
  const body = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const elapsed = body.elapsedMs;

  return {
    name: stripLineBreaks(asString(body.name)).trim(),
    email: asString(body.email).trim(),
    subject: stripLineBreaks(asString(body.subject)).trim(),
    message: asString(body.message).trim(),
    company: asString(body.company).trim(),
    elapsedMs: typeof elapsed === "number" && Number.isFinite(elapsed) ? elapsed : null,
  };
}

export function isAllowedSubject(subject: string): boolean {
  return (CONTACT_SUBJECTS as readonly string[]).includes(subject);
}

/** Field-level validation. Messages are safe to show to users. */
export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length > CONTACT_LIMITS.nameMax) {
    errors.name = `Name must be ${CONTACT_LIMITS.nameMax} characters or fewer.`;
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (email.length > CONTACT_LIMITS.emailMax || !EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!subject) {
    errors.subject = "Subject is required.";
  } else if (!isAllowedSubject(subject)) {
    errors.subject = "Choose a subject from the list.";
  }

  if (!message) {
    errors.message = "Message is required.";
  } else if (message.length < CONTACT_LIMITS.messageMin) {
    errors.message = `Message must be at least ${CONTACT_LIMITS.messageMin} characters.`;
  } else if (message.length > CONTACT_LIMITS.messageMax) {
    errors.message = `Message must be ${CONTACT_LIMITS.messageMax} characters or fewer.`;
  }

  return errors;
}

/**
 * True when the submission looks automated: the honeypot is filled, or the
 * form was submitted faster than a person could fill it. A missing elapsedMs
 * is allowed so the API's original request contract keeps working.
 */
export function isLikelyBot(submission: Pick<ContactSubmission, "company" | "elapsedMs">): boolean {
  if (submission.company.length > 0) return true;
  if (submission.elapsedMs !== null && submission.elapsedMs < CONTACT_LIMITS.minFillMs) return true;
  return false;
}

/** Generic messages returned by the API. Never include provider or config details. */
export const CONTACT_API_MESSAGES = {
  invalid: "Please check the form and try again.",
  tooLarge: "Your message is too long. Please shorten it and try again.",
  unavailable: "The contact form is temporarily unavailable. Please email paul@prodriguez.dev instead.",
  failed: "Your message could not be sent. Please try again or email paul@prodriguez.dev.",
} as const;
