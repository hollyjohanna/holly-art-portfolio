export type Artwork = {
  id: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  src: string;
  width: number;
  height: number;
};

/**
 * Placeholder catalogue. Replace `src`, and the fields below, with real
 * artwork once photography is ready — the id/slug and image aspect ratio
 * (width/height) are what drive the gallery layout, so keep those in sync
 * with the real files when swapping them in.
 */
export const artworks: Artwork[] = [
  {
    id: "untitled-i",
    title: "Untitled I",
    year: 2026,
    medium: "Oil on canvas",
    dimensions: "80 × 80 cm",
    description:
      "Placeholder text — a few lines about the inspiration, palette, and process behind this piece will go here.",
    src: "/works/piece-01.svg",
    width: 900,
    height: 900,
  },
  {
    id: "quiet-static",
    title: "Quiet Static",
    year: 2025,
    medium: "Acrylic on canvas",
    dimensions: "70 × 95 cm",
    description:
      "Placeholder text — replace with notes on materials, scale, and what drew you to this composition.",
    src: "/works/piece-02.svg",
    width: 700,
    height: 950,
  },
  {
    id: "fault-lines",
    title: "Fault Lines",
    year: 2025,
    medium: "Mixed media on board",
    dimensions: "100 × 75 cm",
    description:
      "Placeholder text — describe the series this piece belongs to, or the story behind it.",
    src: "/works/piece-03.svg",
    width: 1000,
    height: 750,
  },
  {
    id: "soft-machine",
    title: "Soft Machine",
    year: 2024,
    medium: "Oil on board",
    dimensions: "60 × 90 cm",
    description:
      "Placeholder text — a sentence or two on technique, and another on meaning.",
    src: "/works/piece-04.svg",
    width: 600,
    height: 900,
  },
  {
    id: "marrow",
    title: "Marrow",
    year: 2026,
    medium: "Ink and gouache on paper",
    dimensions: "50 × 65 cm",
    description:
      "Placeholder text — this is where a short artist statement for the piece will sit.",
    src: "/works/piece-05.svg",
    width: 500,
    height: 650,
  },
  {
    id: "held-breath",
    title: "Held Breath",
    year: 2024,
    medium: "Acrylic and charcoal on canvas",
    dimensions: "90 × 90 cm",
    description:
      "Placeholder text — notes on the exhibition or collection this piece was made for.",
    src: "/works/piece-06.svg",
    width: 900,
    height: 900,
  },
  {
    id: "coastal-drift",
    title: "Coastal Drift",
    year: 2025,
    medium: "Oil on canvas",
    dimensions: "110 × 80 cm",
    description:
      "Placeholder text — replace with a line about the location or memory behind this work.",
    src: "/works/piece-07.svg",
    width: 1100,
    height: 800,
  },
  {
    id: "interior-weather",
    title: "Interior Weather",
    year: 2023,
    medium: "Acrylic on canvas",
    dimensions: "65 × 85 cm",
    description:
      "Placeholder text — a couple of sentences about the emotional register of the piece.",
    src: "/works/piece-08.svg",
    width: 650,
    height: 850,
  },
  {
    id: "afterimage",
    title: "Afterimage",
    year: 2025,
    medium: "Oil on canvas",
    dimensions: "75 × 75 cm",
    description:
      "Placeholder text — swap in real details about pigment, layering, or timeline.",
    src: "/works/piece-09.svg",
    width: 750,
    height: 750,
  },
  {
    id: "low-tide",
    title: "Low Tide",
    year: 2024,
    medium: "Mixed media on canvas",
    dimensions: "95 × 65 cm",
    description:
      "Placeholder text — a description of the physical process behind the piece.",
    src: "/works/piece-10.svg",
    width: 950,
    height: 650,
  },
  {
    id: "paper-moon",
    title: "Paper Moon",
    year: 2026,
    medium: "Gouache on paper",
    dimensions: "45 × 60 cm",
    description:
      "Placeholder text — a note on scale and why the piece is sized the way it is.",
    src: "/works/piece-11.svg",
    width: 450,
    height: 600,
  },
  {
    id: "static-bloom",
    title: "Static Bloom",
    year: 2023,
    medium: "Acrylic on canvas",
    dimensions: "80 × 100 cm",
    description:
      "Placeholder text — replace with the story of how this piece came together.",
    src: "/works/piece-12.svg",
    width: 800,
    height: 1000,
  },
  {
    id: "vessel",
    title: "Vessel",
    year: 2025,
    medium: "Oil on board",
    dimensions: "70 × 70 cm",
    description:
      "Placeholder text — this is a good spot for a quote or short reflection.",
    src: "/works/piece-13.svg",
    width: 700,
    height: 700,
  },
  {
    id: "night-swim",
    title: "Night Swim",
    year: 2024,
    medium: "Oil on canvas",
    dimensions: "100 × 130 cm",
    description:
      "Placeholder text — describe the palette choices or lighting reference used.",
    src: "/works/piece-14.svg",
    width: 770,
    height: 1000,
  },
  {
    id: "threshold",
    title: "Threshold",
    year: 2026,
    medium: "Mixed media on board",
    dimensions: "85 × 60 cm",
    description:
      "Placeholder text — add availability, price on request, or collection info here.",
    src: "/works/piece-15.svg",
    width: 850,
    height: 600,
  },
  {
    id: "untitled-ii",
    title: "Untitled II",
    year: 2026,
    medium: "Acrylic on canvas",
    dimensions: "120 × 68 cm",
    description:
      "Placeholder text — the newest piece in the collection, description coming soon.",
    src: "/works/piece-16.svg",
    width: 1200,
    height: 680,
  },
];
