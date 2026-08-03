import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Holly Johanna",
  description: "Get in touch about a piece, a commission, or anything else.",
};

export default function ContactPage() {
  return (
    <div className="container-page py-10 sm:py-16">
      <Reveal>
        <h1 className="font-display text-2xl sm:text-3xl">Contact</h1>
        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-ink/50">
          Questions about a piece, commissions, or just want to say hello —
          drop a message below.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 max-w-lg">
        <ContactForm />
      </Reveal>
    </div>
  );
}
