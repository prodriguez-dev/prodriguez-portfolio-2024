import { describe, expect, it } from "vitest";
import {
  CONTACT_LIMITS,
  CONTACT_SUBJECTS,
  isLikelyBot,
  normalizeContactSubmission,
  stripLineBreaks,
  validateContact,
} from "../../src/lib/contact-validation";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: CONTACT_SUBJECTS[0],
  message: "Hello, I would like to talk about a project.",
};

describe("validateContact", () => {
  it("accepts a valid submission", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("requires every field", () => {
    expect(validateContact({ name: " ", email: "", subject: "", message: "" })).toEqual({
      name: "Name is required.",
      email: "Email is required.",
      subject: "Subject is required.",
      message: "Message is required.",
    });
  });

  it("rejects malformed and over-long emails", () => {
    expect(validateContact({ ...valid, email: "not-an-email" }).email).toBe("Enter a valid email address.");
    const long = `${"a".repeat(CONTACT_LIMITS.emailMax)}@example.com`;
    expect(validateContact({ ...valid, email: long }).email).toBe("Enter a valid email address.");
  });

  it("enforces name and message length limits", () => {
    expect(validateContact({ ...valid, name: "x".repeat(CONTACT_LIMITS.nameMax + 1) }).name).toMatch(/or fewer/);
    expect(validateContact({ ...valid, name: "x".repeat(CONTACT_LIMITS.nameMax) }).name).toBeUndefined();
    expect(validateContact({ ...valid, message: "too short" }).message).toMatch(/at least 10/);
    expect(validateContact({ ...valid, message: "x".repeat(CONTACT_LIMITS.messageMax + 1) }).message).toMatch(/or fewer/);
    expect(validateContact({ ...valid, message: "x".repeat(CONTACT_LIMITS.messageMax) }).message).toBeUndefined();
  });

  it("only allows subjects from the allow-list", () => {
    expect(validateContact({ ...valid, subject: "Buy cheap watches" }).subject).toBe("Choose a subject from the list.");
    for (const subject of CONTACT_SUBJECTS) expect(validateContact({ ...valid, subject }).subject).toBeUndefined();
  });
});

describe("normalizeContactSubmission", () => {
  it("coerces junk input without throwing", () => {
    for (const input of [null, undefined, 42, "str", [], { name: 5, email: {}, elapsedMs: "100" }]) {
      expect(normalizeContactSubmission(input)).toEqual({
        name: "",
        email: "",
        subject: "",
        message: "",
        company: "",
        elapsedMs: null,
      });
    }
  });

  it("strips CR/LF from name and subject but keeps message line breaks", () => {
    const out = normalizeContactSubmission({
      name: "Eve\r\nBcc: victim@example.com",
      subject: "Other\nX-Injected: 1",
      message: "line one\nline two",
      email: " ada@example.com ",
      elapsedMs: 4200,
    });
    expect(out.name).toBe("Eve Bcc: victim@example.com");
    expect(out.subject).toBe("Other X-Injected: 1");
    expect(out.message).toBe("line one\nline two");
    expect(out.email).toBe("ada@example.com");
    expect(out.elapsedMs).toBe(4200);
  });

  it("rejects non-finite elapsedMs", () => {
    expect(normalizeContactSubmission({ elapsedMs: Number.NaN }).elapsedMs).toBeNull();
    expect(normalizeContactSubmission({ elapsedMs: Infinity }).elapsedMs).toBeNull();
  });
});

describe("isLikelyBot", () => {
  it("flags a filled honeypot", () => {
    expect(isLikelyBot({ company: "Acme", elapsedMs: 60_000 })).toBe(true);
  });

  it("flags submissions faster than the minimum fill time", () => {
    expect(isLikelyBot({ company: "", elapsedMs: CONTACT_LIMITS.minFillMs - 1 })).toBe(true);
    expect(isLikelyBot({ company: "", elapsedMs: CONTACT_LIMITS.minFillMs })).toBe(false);
  });

  it("allows a missing timing value to keep the original API contract", () => {
    expect(isLikelyBot({ company: "", elapsedMs: null })).toBe(false);
  });
});

describe("stripLineBreaks", () => {
  it("collapses any run of CR/LF into one space", () => {
    expect(stripLineBreaks("a\r\n\r\nb\nc")).toBe("a b c");
  });
});
