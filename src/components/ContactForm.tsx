"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Status = "idle" | "submitting" | "success" | "error";

const EASE = [0.22, 1, 0.36, 1] as const;

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      message: String(data.get("message") || ""),
      website: String(data.get("website") || ""),
      startedAt: startedAt.current || undefined,
    };

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
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus("idle");
          }}
          className="mt-6 border-hairline-strong bg-transparent px-5 py-2.5 label text-ink/70 transition-colors duration-300 hover:bg-cream hover:text-ink active:translate-y-[1px]"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
          className="border-hairline bg-cream px-4 py-3 text-sm outline-none transition-colors duration-300 placeholder:text-ink/25 focus:border-ink/35 focus:bg-blue/10"
          placeholder="Your name"
        />
      </label>

      <label className="flex flex-col gap-2.5">
        <span className="label text-ink/45">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          maxLength={MAX_EMAIL_LENGTH}
          className="border-hairline bg-cream px-4 py-3 text-sm outline-none transition-colors duration-300 placeholder:text-ink/25 focus:border-ink/35 focus:bg-blue/10"
          placeholder="you@example.com"
        />
      </label>

      <label className="flex flex-col gap-2.5">
        <span className="label text-ink/45">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
          className="border-hairline bg-cream px-4 py-3 text-sm leading-relaxed outline-none transition-colors duration-300 placeholder:text-ink/25 focus:border-ink/35 focus:bg-blue/10 resize-none"
          placeholder="Say hello, ask about a piece, or enquire about a commission."
        />
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
