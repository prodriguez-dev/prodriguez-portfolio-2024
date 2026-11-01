import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { CONTACT_API_MESSAGES } from "@/lib/contact-validation";

const valid = {
  name: "Ada",
  email: "ada@example.com",
  subject: "General Inquiry",
  message: "Hello there, testing.",
};

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sends a valid message and returns ok", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const res = await post({ ...valid, company: "", elapsedMs: 5000 });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledOnce();
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.subject).toBe("[Portfolio] General Inquiry");
    expect(sent.reply_to).toBe("ada@example.com");
  });

  it("hides provider error text behind a generic message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("API key is invalid: secret detail", { status: 401 })));
    const res = await post(valid);
    expect(res.status).toBe(502);
    const text = await res.text();
    expect(text).not.toMatch(/API key|secret detail/);
    expect(JSON.parse(text)).toEqual({ error: CONTACT_API_MESSAGES.failed });
  });

  it("returns a generic error when the provider is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNRESET")));
    const res = await post(valid);
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: CONTACT_API_MESSAGES.failed });
  });

  it("does not mention env var names when unconfigured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await post(valid);
    expect(res.status).toBe(503);
    expect(await res.text()).not.toMatch(/RESEND|CONTACT_EMAIL/);
  });

  it("silently drops honeypot and too-fast submissions without calling the provider", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    for (const extra of [{ company: "Acme", elapsedMs: 9000 }, { company: "", elapsedMs: 500 }]) {
      const res = await post({ ...valid, ...extra });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects empty, malformed, and oversized bodies", async () => {
    expect((await post({})).status).toBe(400);
    expect((await post("{not json")).status).toBe(400);
    expect((await post({ ...valid, message: "a".repeat(20_000) })).status).toBe(413);
  });
});
