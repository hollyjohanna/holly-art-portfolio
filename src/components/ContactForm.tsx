"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Status = "idle" | "submitting" | "success" | "error";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
        className="border-brutal bg-gold/60 p-8 text-center"
      >
        <p className="font-display text-xl">Message sent</p>
        <p className="mt-2 text-sm text-ink/70">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 border-brutal bg-cream px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-300 hover:bg-blue active:translate-y-[1px]"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink/60">
          Name
        </span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          className="border-brutal bg-cream px-4 py-3 text-base outline-none transition-colors duration-300 focus:bg-blue/20"
          placeholder="Your name"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink/60">
          Email
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="border-brutal bg-cream px-4 py-3 text-base outline-none transition-colors duration-300 focus:bg-blue/20"
          placeholder="you@example.com"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink/60">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="border-brutal bg-cream px-4 py-3 text-base outline-none transition-colors duration-300 focus:bg-blue/20 resize-none"
          placeholder="Say hello, ask about a piece, or enquire about a commission."
        />
      </label>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-sm font-medium text-rose"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={status === "submitting"}
        whileTap={{ scale: 0.97 }}
        className="mt-2 self-start border-brutal bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-cream shadow-brutal-sm transition-colors duration-300 hover:bg-rose disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </motion.button>
    </form>
  );
}
