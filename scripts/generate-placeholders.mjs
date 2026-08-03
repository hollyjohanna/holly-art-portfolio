// One-off script to generate abstract placeholder SVG "paintings" and
// portrait placeholders in the site palette. Run with:
//   node scripts/generate-placeholders.mjs
// Safe to delete once real artwork/photos are in place.

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const INK = "#0E1104";
const CREAM = "#FFF8E7";
const BLUE = "#93B5C6";
const GOLD = "#F4DD90";
const ROSE = "#C76B84";
const PALETTE = [CREAM, BLUE, GOLD, ROSE];

// Outlines sit well below full ink so the shapes read as drawn, not stamped.
const STROKE = `stroke="${INK}" stroke-opacity="0.5"`;

// Small deterministic PRNG so re-running produces identical output.
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function shapeRect(rng, w, h) {
  const rw = w * (0.2 + rng() * 0.5);
  const rh = h * (0.15 + rng() * 0.5);
  const x = rng() * (w - rw);
  const y = rng() * (h - rh);
  const fill = pick(rng, PALETTE);
  const rotate = (rng() - 0.5) * 20;
  return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${rw.toFixed(
    1
  )}" height="${rh.toFixed(
    1
  )}" fill="${fill}" ${STROKE} stroke-width="2.5" transform="rotate(${rotate.toFixed(
    1
  )} ${(x + rw / 2).toFixed(1)} ${(y + rh / 2).toFixed(1)})" />`;
}

function shapeCircle(rng, w, h) {
  const r = Math.min(w, h) * (0.1 + rng() * 0.22);
  const cx = rng() * w;
  const cy = rng() * h;
  const fill = pick(rng, PALETTE);
  return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1  )}" r="${r.toFixed(
    1
  )}" fill="${fill}" ${STROKE} stroke-width="2.5" />`;
}

function shapeLine(rng, w, h) {
  const x1 = rng() * w;
  const y1 = rng() * h;
  const x2 = rng() * w;
  const y2 = rng() * h;
  return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(
    1
  )}" y2="${y2.toFixed(1)}" ${STROKE} stroke-width="2" stroke-linecap="round" />`;
}

function shapeTriangle(rng, w, h) {
  const cx = rng() * w;
  const cy = rng() * h;
  const size = Math.min(w, h) * (0.15 + rng() * 0.25);
  const rotate = rng() * 360;
  const fill = pick(rng, PALETTE);
  const pts = [
    [cx, cy - size],
    [cx + size * 0.87, cy + size * 0.5],
    [cx - size * 0.87, cy + size * 0.5],
  ]
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  return `<polygon points="${pts}" fill="${fill}" ${STROKE} stroke-width="2.5" transform="rotate(${rotate.toFixed(
    1
  )} ${cx.toFixed(1)} ${cy.toFixed(1)})" />`;
}

function generateArtworkSvg(seed, w, h, background) {
  const rng = mulberry32(seed);
  const shapeCount = 5 + Math.floor(rng() * 4);
  const generators = [shapeRect, shapeCircle, shapeTriangle, shapeLine];
  const shapes = [];
  for (let i = 0; i < shapeCount; i++) {
    const gen = pick(rng, generators);
    shapes.push(gen(rng, w, h));
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${background}" />
  ${shapes.join("\n  ")}
</svg>
`;
}

function generatePortraitSvg(seed, w, h) {
  const rng = mulberry32(seed);
  const background = pick(rng, [CREAM, BLUE, GOLD]);
  const shapes = [];
  // Simple abstracted head-and-shoulders silhouette.
  const cx = w / 2;
  shapes.push(
    `<circle cx="${cx}" cy="${h * 0.34}" r="${w * 0.16}" fill="${INK}" fill-opacity="0.72" />`
  );
  shapes.push(
    `<path d="M ${cx - w * 0.28} ${h * 0.95} Q ${cx - w * 0.3} ${h * 0.55} ${cx} ${h * 0.5} Q ${cx + w * 0.3} ${h * 0.55} ${cx + w * 0.28} ${h * 0.95} Z" fill="${INK}" fill-opacity="0.72" />`
  );
  for (let i = 0; i < 3; i++) {
    shapes.push(shapeRect(rng, w, h * 0.3));
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${background}" />
  ${shapes.join("\n  ")}
</svg>
`;
}

const artworkSizes = [
  [900, 900],
  [700, 950],
  [1000, 750],
  [600, 900],
  [500, 650],
  [900, 900],
  [1100, 800],
  [650, 850],
  [750, 750],
  [950, 650],
  [450, 600],
  [800, 1000],
  [700, 700],
  [770, 1000],
  [850, 600],
  [1200, 680],
];

const worksDir = path.join(publicDir, "works");
mkdirSync(worksDir, { recursive: true });

artworkSizes.forEach(([w, h], i) => {
  const seed = 1000 + i * 37;
  const background = pick(mulberry32(seed + 1), [CREAM, BLUE, GOLD, ROSE]);
  const svg = generateArtworkSvg(seed, w, h, background);
  const filename = `piece-${String(i + 1).padStart(2, "0")}.svg`;
  writeFileSync(path.join(worksDir, filename), svg, "utf8");
  console.log("wrote", filename);
});

const aboutDir = path.join(publicDir, "about");
mkdirSync(aboutDir, { recursive: true });

const portraitSizes = [
  [800, 1000],
  [900, 900],
  [800, 1000],
];

portraitSizes.forEach(([w, h], i) => {
  const seed = 5000 + i * 91;
  const svg = generatePortraitSvg(seed, w, h);
  const filename = `photo-${String(i + 1).padStart(2, "0")}.svg`;
  writeFileSync(path.join(aboutDir, filename), svg, "utf8");
  console.log("wrote", filename);
});

console.log("Done generating placeholders.");
