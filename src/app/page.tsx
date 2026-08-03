import Gallery from "@/components/Gallery";
import { artworks } from "@/lib/artworks";

export default function WorksPage() {
  return (
    <div className="px-6 sm:px-10 py-10 sm:py-16">
      <header className="mb-10 sm:mb-14">
        <h1 className="font-display text-2xl sm:text-3xl">Works</h1>
        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-ink/50">
          A selection of paintings and pieces. Click any piece for more detail.
        </p>
      </header>
      <Gallery artworks={artworks} />
    </div>
  );
}
