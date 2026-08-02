import Gallery from "@/components/Gallery";
import { artworks } from "@/lib/artworks";

export default function WorksPage() {
  return (
    <div className="px-4 sm:px-8 py-8 sm:py-12">
      <header className="mb-8 sm:mb-10">
        <h1 className="font-display text-3xl sm:text-4xl">Works</h1>
        <p className="mt-2 max-w-lg text-sm sm:text-base text-ink/60">
          A selection of paintings and pieces. Click any piece for more detail.
        </p>
      </header>
      <Gallery artworks={artworks} />
    </div>
  );
}
