import type { Metadata } from "next";
import Link from "next/link";
import OtherWorksGallery from "@/components/OtherWorksGallery";
import { otherWorks } from "@/lib/otherWorks";

export const metadata: Metadata = {
  title: "Other Works - Holly Johanna",
  description: "A looser collection of sketches and side pieces by Holly Johanna.",
};

export default function OtherWorksPage() {
  return (
    <div className="container-page py-10 sm:py-16">
      <nav aria-label="Breadcrumb" className="label mb-4 flex items-center gap-2 text-ink/40">
        <Link href="/" className="transition-colors duration-300 hover:text-ink/80">
          Works
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink/70">Other Works</span>
      </nav>
      <header className="mb-10 sm:mb-14">
        <h1 className="font-display text-2xl sm:text-3xl">Other Works</h1>
        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-ink/50">
          A looser collection of sketches and side pieces. Click any image to browse.
        </p>
      </header>
      <OtherWorksGallery works={otherWorks} />
    </div>
  );
}
