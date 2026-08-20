import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Contact - Holly Johanna",
  description: "Get in touch about a piece, a commission, or anything else.",
};

const faqs = [
  {
    q: "How long do commissions take?",
    a: "It depends! Usually 4–6 weeks depending on size and complexity. I'll give you a clearer estimate once we've talked through the piece.",
  },
  {
    q: "Do you ship internationally?",
    a: "For sure! Original works are packed carefully and can be shipped worldwide; shipping cost depends on size and destination.",
  },
  {
    q: "How much does a piece cost?",
    a: "It varies by size and medium, I list prices for all available artworks. If you want to commission a piece send a message with what you have in mind as well as size and I'll get back to you with pricing. I am more than hapy to work within your budget and am open to trades as well!",
  },
  {
    q: "What should I do if I wish to buy a piece?",
    a: "Send me an email with the piece name you wish to purchase and where you are located and I will be in touch regarding getting the piece to you!",
  },
];

export default function ContactPage() {
  return (
    <div className="container-page py-10 sm:py-16">
      <Reveal>
        <h1 className="font-display text-2xl sm:text-3xl">Contact</h1>
        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-ink/50">
          Questions about a piece, commissions, or just want to say hello -
          drop a message below.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>

        <Reveal delay={0.15} className="max-w-sm">
          <h2 className="font-display text-lg sm:text-xl">
            Frequently Asked Questions
          </h2>
          <FaqAccordion items={faqs} className="mt-6" />
        </Reveal>
      </div>
    </div>
  );
}
