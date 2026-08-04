import type { Metadata } from "next";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About - Holly Johanna",
  description: "A little about Holly Johanna and her practice.",
};

const photos = [
  {
    src: "/about/photo-01.jpg",
    alt: "Holly Johanna, studio portrait",
  },
  {
    src: "/about/photo-02.jpg",
    alt: "Holly Johanna outside, leather jacket",
  },
  {
    src: "/about/photo-03.jpg",
    alt: "Holly Johanna at a cafe table",
  },
  {
    src: "/about/photo-04.jpg",
    alt: "Holly Johanna by the waterfront",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page py-10 sm:py-16">
      <Reveal>
        <h1 className="font-display text-2xl sm:text-3xl">About</h1>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
        <Reveal delay={0.05}>
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {photos.map((photo) => (
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                className="aspect-[3/4] w-full border-hairline bg-cream object-cover shadow-soft transition-transform duration-500 ease-out hover:scale-[1.03]"
              />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col gap-6 max-w-prose">
          <p className="text-sm sm:text-[15px] leading-relaxed text-ink/80">
            [Placeholder] Hi, I&apos;m Holly Johanna — a painter working
            primarily in oil and acrylic, based somewhere lovely. This is
            where a proper introduction will go once you send over the real
            copy: how you started, what draws you to the work you make, and
            what a day in the studio looks like.
          </p>
          <p className="text-sm sm:text-[15px] leading-relaxed text-ink/60">
            [Placeholder] A second paragraph can dig into your journey — art
            school, early influences, the moment things clicked, exhibitions
            you&apos;ve shown in, or the throughline that connects the pieces
            in the Works section.
          </p>
          <div className="border-l border-ink/25 bg-gold/25 py-4 pl-5 pr-4">
            <p className="font-display text-sm sm:text-[15px] leading-relaxed">
              &ldquo;[Placeholder quote — a short line about your practice or
              philosophy can live here.]&rdquo;
            </p>
          </div>
          <p className="text-sm sm:text-[15px] leading-relaxed text-ink/60">
            [Placeholder] Close things out with what&apos;s next: upcoming
            shows, commission availability, or simply an invite to get in
            touch via the Contact page.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
