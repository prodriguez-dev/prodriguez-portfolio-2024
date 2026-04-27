"use client";

import { FormEvent, useMemo, useState } from "react";
import clsx from "clsx";

type ContactFormProps = {
  subjects: string[];
};

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState = (subjects: string[]): FormState => ({
  name: "",
  email: "",
  subject: subjects[0] || "",
  message: "",
});

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.subject.trim()) errors.subject = "Subject is required.";
  if (!values.message.trim()) {
    errors.message = "Message is required.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }

  return errors;
}

export default function ContactForm({ subjects }: ContactFormProps) {
  const [values, setValues] = useState<FormState>(() => initialState(subjects));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasSubjects = useMemo(() => subjects.length > 0, [subjects.length]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || "Something went wrong. Please try again.");
      }

      setIsSuccess(true);
      setValues(initialState(subjects));
      setErrors({});
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  if (isSuccess) {
    return (
      <div className="rounded-[20px] border border-[#e0dbd0] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)] md:p-11">
        <div className="text-4xl">✉️</div>
        <h3 className="mt-4 font-[var(--font-sofia-sans-extra-condensed)] text-[clamp(2.2rem,5vw,3.4rem)] font-black uppercase italic leading-none text-[#111111]">
          Message Sent!
        </h3>
        <p className="mt-4 text-[17px] leading-8 text-[#4d4a45]">
          Thanks. Your message is on its way to Paul.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSuccess(false);
            setSubmitError(null);
          }}
          className="mt-8 inline-flex rounded-[10px] border border-[#e0dbd0] bg-white px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[#111111] transition hover:-translate-y-0.5 hover:border-[#bdb8ae]"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[20px] border border-[#e0dbd0] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)] md:p-11">
      <div className="mb-6">
        <h2 className="font-[var(--font-sofia-sans-extra-condensed)] text-[clamp(2.2rem,5vw,3.6rem)] font-black uppercase italic leading-none text-[#111111]">
          Start the conversation
        </h2>
        <p className="mt-3 text-[16px] leading-7 text-[#4d4a45]">
          Tell me what you&apos;re working on and I&apos;ll get back to you.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#111111]">Name</span>
          <input
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={clsx(
              "w-full rounded-[10px] border px-[18px] py-[14px] text-[16px] outline-none transition focus:border-[#c4621a]",
              errors.name ? "border-[#d55c45]" : "border-[#e0dbd0]",
            )}
            placeholder="Your name"
          />
          {errors.name && <span className="mt-2 block text-sm text-[#d55c45]">{errors.name}</span>}
        </label>
        <label className="block">
          <span className="mb-2 block text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#111111]">Email</span>
          <input
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={clsx(
              "w-full rounded-[10px] border px-[18px] py-[14px] text-[16px] outline-none transition focus:border-[#c4621a]",
              errors.email ? "border-[#d55c45]" : "border-[#e0dbd0]",
            )}
            placeholder="you@example.com"
            type="email"
          />
          {errors.email && <span className="mt-2 block text-sm text-[#d55c45]">{errors.email}</span>}
        </label>
      </div>
      <label className="mt-5 block">
        <span className="mb-2 block text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#111111]">Subject</span>
        <select
          value={values.subject}
          onChange={(event) => updateField("subject", event.target.value)}
          className={clsx(
            "w-full rounded-[10px] border bg-white px-[18px] py-[14px] text-[16px] outline-none transition focus:border-[#c4621a]",
            errors.subject ? "border-[#d55c45]" : "border-[#e0dbd0]",
          )}
          disabled={!hasSubjects}
        >
          {subjects.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
        {errors.subject && <span className="mt-2 block text-sm text-[#d55c45]">{errors.subject}</span>}
      </label>
      <label className="mt-5 block">
        <span className="mb-2 block text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#111111]">Message</span>
        <textarea
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          className={clsx(
            "min-h-[180px] w-full rounded-[10px] border px-[18px] py-[14px] text-[16px] outline-none transition focus:border-[#c4621a]",
            errors.message ? "border-[#d55c45]" : "border-[#e0dbd0]",
          )}
          placeholder="Tell me a bit about what you need."
        />
        {errors.message && <span className="mt-2 block text-sm text-[#d55c45]">{errors.message}</span>}
      </label>
      {submitError && <div className="mt-5 rounded-[12px] border border-[#f1c3ba] bg-[#fff5f3] px-4 py-3 text-sm text-[#a33d2f]">{submitError}</div>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex rounded-[10px] bg-[#c4621a] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
