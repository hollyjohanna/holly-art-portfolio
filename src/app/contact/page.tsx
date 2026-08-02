import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Holly Johanna",
  description: "Get in touch about a piece, a commission, or anything else.",
};

export default function ContactPage() {
  return (
    <div className="px-4 sm:px-8 py-8 sm:py-12">
      <Reveal>
        <h1 className="font-display text-3xl sm:text-4xl">Contact</h1>
        <p className="mt-2 max-w-lg text-sm sm:text-base text-ink/60">
          Questions about a piece, commissions, or just want to say hello —
          drop a message below.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-8 max-w-xl">
        <ContactForm />
      </Reveal>
    </div>
  );
}
