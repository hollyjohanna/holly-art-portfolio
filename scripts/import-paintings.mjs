// Import painting folders into public/works as web-sized JPEGs and
 // regenerate src/lib/artworks.ts with placeholder metadata.
 //
 // Usage:
 //   node scripts/import-paintings.mjs

import { mkdirSync, readdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE =
  "/Users/Holly.Robbins/Pictures/Art:Design/Images and Assets for Art Portfolio/Paintings";
const OUT_DIR = join(ROOT, "public", "works");
const ARTWORKS_PATH = join(ROOT, "src", "lib", "artworks.ts");
const MAX_EDGE = 1800;
const JPEG_QUALITY = 82;

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"]);

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function parseIndex(filename) {
  const match = filename.match(/^(\d+)\s+/);
  return match ? Number(match[1]) : Infinity;
}

function getDimensions(path) {
  const out = execFileSync(
    "sips",
    ["-g", "pixelWidth", "-g", "pixelHeight", path],
    { encoding: "utf8" }
  );
  const width = Number(out.match(/pixelWidth:\s*(\d+)/)?.[1] || 0);
  const height = Number(out.match(/pixelHeight:\s*(\d+)/)?.[1] || 0);
  return { width, height };
}

function convertToJpeg(src, dest) {
  execFileSync(
    "sips",
    [
      "-s",
      "format",
      "jpeg",
      "-s",
      "formatOptions",
      String(JPEG_QUALITY),
      "--resampleHeightWidthMax",
      String(MAX_EDGE),
      src,
      "--out",
      dest,
    ],
    { stdio: "pipe" }
  );
}

// Clean previous works assets (placeholders + prior imports)
if (existsSync(OUT_DIR)) {
  for (const entry of readdirSync(OUT_DIR, { withFileTypes: true })) {
    rmSync(join(OUT_DIR, entry.name), { recursive: true, force: true });
  }
}
mkdirSync(OUT_DIR, { recursive: true });

const folders = readdirSync(SOURCE, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith("."))
  .map((d) => d.name)
  .sort((a, b) => a.localeCompare(b));

const artworks = [];

for (const folder of folders) {
  const folderPath = join(SOURCE, folder);
  const slug = slugify(folder);
  const title = titleCase(folder);
  const destDir = join(OUT_DIR, slug);
  mkdirSync(destDir, { recursive: true });

  const files = readdirSync(folderPath)
    .filter((f) => IMAGE_EXTS.has(extname(f).toLowerCase()) && !f.startsWith("."))
    .sort((a, b) => parseIndex(a) - parseIndex(b) || a.localeCompare(b));

  if (files.length === 0) {
    console.warn(`skip empty folder: ${folder}`);
    continue;
  }

  const images = [];
  files.forEach((file, i) => {
    const src = join(folderPath, file);
    const destName = `${String(i + 1).padStart(2, "0")}.jpg`;
    const dest = join(destDir, destName);
    console.log(`  ${folder}/${file} → works/${slug}/${destName}`);
    convertToJpeg(src, dest);
    const { width, height } = getDimensions(dest);
    images.push({
      src: `/works/${slug}/${destName}`,
      width,
      height,
    });
  });

  artworks.push({
    id: slug,
    title,
    year: 0,
    medium: "[Medium]",
    dimensions: "[Dimensions]",
    description:
      "Placeholder text — a short note about this piece will go here.",
    images,
  });
}

const ts = `export type ArtworkImage = {
  src: string;
  width: number;
  height: number;
};

export type Artwork = {
  id: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  /** First image is the cover shown on the Works page. */
  images: ArtworkImage[];
};

/**
 * Catalogue generated from the Paintings folder.
 * Fill in year / medium / dimensions / description when ready.
 * Image paths and dimensions are driven by the imported files —
 * re-run \`node scripts/import-paintings.mjs\` after adding photos.
 */
export const artworks: Artwork[] = ${JSON.stringify(artworks, null, 2)};
`;

writeFileSync(ARTWORKS_PATH, ts, "utf8");
console.log(`\nWrote ${artworks.length} artworks → ${ARTWORKS_PATH}`);
