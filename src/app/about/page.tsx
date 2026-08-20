import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SocialLinks from "@/components/SocialLinks";

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
            Hello, Kia Ora, Bonjour
          </p>
          <p className="text-sm sm:text-[15px] leading-relaxed text-ink/80">
            I am Holly, a painter/artist working
            primarily in acrylic paint, although I am partial to many other
            mediums such as oil paint, indian ink, watercolour, mixed media,
            alcohol markers and many many more.
          </p>
          {/* <p className="text-sm sm:text-[15px] leading-relaxed text-ink/60">
            Currently I am based in Melbourne, though I tend to move around a
            lot. I am originally from New Zealand but hope to live in Europe
            for a period of time soon.
          </p> */}
          <p className="text-sm sm:text-[15px] leading-relaxed text-ink/60">
            I have always loved creating art — ask my mum just how many
            childhood paintings she has stored in the attic! My mum, in fact,
            is one of my earliest inspirations and she continues to support
            me to this day. She is endlessly inventive and taught me early on
            how to sew, knit, paint, craft, bead, draw and explore expression
            through creativity.
          </p>
          <div className="border-l border-ink/25 bg-gold/25 py-4 pl-5 pr-4">
            <p className="font-display text-sm sm:text-[15px] leading-relaxed">
              &ldquo;Every child is an artist. The problem is how to remain an
              artist once he grows up.&rdquo;
            </p>
            <p className="mt-2 text-xs sm:text-sm text-ink/50">
              - Pablo Picasso
            </p>
          </div>
          <p className="text-sm sm:text-[15px] leading-relaxed text-ink/80">
            Only recently as an adult have I started to realise that creating
            art has been and will always be an enormous part of my life and
            self expression, and as such I have started to take it more
            seriously. I have begun selling my works and taking commissions,
            and in the near future I hope to do an artist residency and truly
            focus all of my energy into this central pillar of my life.
          </p>
          <p className="text-sm sm:text-[15px] leading-relaxed text-ink/80">
            Thanks for reading!
          </p>
          <SocialLinks className="mt-2" />
        </Reveal>
      </div>
    </div>
  );
}
