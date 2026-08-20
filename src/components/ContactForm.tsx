"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = { name?: string; email?: string; message?: string };

const EASE = [0.22, 1, 0.36, 1] as const;

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_PHONE_LENGTH = 30;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [messageLength, setMessageLength] = useState(0);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      message: String(data.get("message") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      website: String(data.get("website") || ""),
      startedAt: startedAt.current || undefined,
    };

    const nextErrors: FieldErrors = {};
    if (!payload.name) nextErrors.name = "Name is required";
    if (!payload.email) {
      nextErrors.email = "Email is required";
    } else if (!EMAIL_PATTERN.test(payload.email)) {
      nextErrors.email = "Enter a valid email";
    }
    if (!payload.message) nextErrors.message = "Message is required";

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Something went wrong.");
      }

      setStatus("success");
      setMessageLength(0);
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="border-hairline bg-gold/25 p-8 text-center"
      >
        <p className="font-display text-lg">Message sent</p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
          Thanks for reaching out - I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus("idle");
            setFieldErrors({});
          }}
          className="mt-6 border-hairline-strong bg-transparent px-5 py-2.5 label text-ink/70 transition-colors duration-300 hover:bg-cream hover:text-ink active:translate-y-[1px]"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Hidden from people, but automated form-fillers will complete it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex flex-col gap-2.5">
        <span className="label text-ink/45">Name</span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          maxLength={MAX_NAME_LENGTH}
          onChange={() =>
            fieldErrors.name &&
            setFieldErrors((prev) => ({ ...prev, name: undefined }))
          }
          className={`border-hairline bg-cream px-4 py-3 text-sm outline-none transition-colors duration-300 placeholder:text-ink/25 focus:border-ink/35 focus:bg-rose/10 ${
            fieldErrors.name ? "!border-rose" : ""
          }`}
          placeholder="Your name"
        />
        {fieldErrors.name && (
          <p className="text-xs text-rose">{fieldErrors.name}</p>
        )}
      </label>

      <label className="flex flex-col gap-2.5">
        <span className="label text-ink/45">Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          maxLength={MAX_EMAIL_LENGTH}
          onChange={() =>
            fieldErrors.email &&
            setFieldErrors((prev) => ({ ...prev, email: undefined }))
          }
          className={`border-hairline bg-cream px-4 py-3 text-sm outline-none transition-colors duration-300 placeholder:text-ink/25 focus:border-ink/35 focus:bg-rose/10 ${
            fieldErrors.email ? "!border-rose" : ""
          }`}
          placeholder="you@example.com"
        />
        {fieldErrors.email && (
          <p className="text-xs text-rose">{fieldErrors.email}</p>
        )}
      </label>

      <label className="flex flex-col gap-2.5">
        <span className="label text-ink/45">Phone (optional)</span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          maxLength={MAX_PHONE_LENGTH}
          className="border-hairline bg-cream px-4 py-3 text-sm outline-none transition-colors duration-300 placeholder:text-ink/25 focus:border-ink/35 focus:bg-rose/10"
          placeholder="Your phone number"
        />
      </label>

      <label className="flex flex-col gap-2.5">
        <span className="label text-ink/45">Message</span>
        <textarea
          name="message"
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(e) => {
            setMessageLength(e.target.value.length);
            if (fieldErrors.message) {
              setFieldErrors((prev) => ({ ...prev, message: undefined }));
            }
          }}
          className={`border-hairline bg-cream px-4 py-3 text-sm leading-relaxed outline-none transition-colors duration-300 placeholder:text-ink/25 focus:border-ink/35 focus:bg-rose/10 resize-none ${
            fieldErrors.message ? "!border-rose" : ""
          }`}
          placeholder="Say hello, ask about a piece, or enquire about a commission."
        />
        <div className="flex items-center justify-between">
          {fieldErrors.message ? (
            <p className="text-xs text-rose">{fieldErrors.message}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-ink/35">
            {messageLength}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
      </label>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-[13px] text-rose"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={status === "submitting"}
        whileTap={{ scale: 0.98 }}
        className="mt-2 self-start border-hairline-strong bg-transparent px-7 py-3 label text-ink/80 transition-colors duration-300 hover:bg-ink hover:text-cream disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </motion.button>
    </form>
  );
}
