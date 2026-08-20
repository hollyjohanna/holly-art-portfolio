import Gallery from "@/components/Gallery";
import FeaturedOtherWorks from "@/components/FeaturedOtherWorks";
import { artworks } from "@/lib/artworks";
import { featuredOtherWorks } from "@/lib/featuredOtherWorks";

export default function WorksPage() {
  return (
    <div className="container-page py-10 sm:py-16">
      <header className="mb-10 sm:mb-14">
        <h1 className="font-display text-2xl sm:text-3xl">Works</h1>
        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-ink/50">
          A selection of paintings and pieces. Click any piece for more detail.
        </p>
      </header>
      <Gallery artworks={artworks} />
      <FeaturedOtherWorks works={featuredOtherWorks} />
    </div>
  );
}
