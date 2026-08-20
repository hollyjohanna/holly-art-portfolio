// Wipes public/other-works and regenerates it from scratch out of the
// Drawings folder as web-sized JPEGs, plus src/lib/otherWorks.ts.
//
// Every source filename must end in "-afp" (available for print) or
// "-nafp" (not available for print); everything before that suffix becomes
// the title, e.g. "Art Nouveau-afp.jpg" -> title "Art Nouveau", print: true.
// There is no hand-edited metadata to preserve — safe to re-run any time
// photos are added, removed, renamed, or replaced.
//
// Usage:
//   node scripts/import-other-works.mjs

import {
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  renameSync,
  rmSync,
  existsSync,
} from "node:fs";
import { join, extname } from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE =
  "/Users/Holly.Robbins/Pictures/Art:Design/Images and Assets for Art Portfolio/Drawings";
const OUT_DIR = join(ROOT, "public", "other-works");
const DATA_PATH = join(ROOT, "src", "lib", "otherWorks.ts");
const MAX_EDGE = 1800;
const JPEG_QUALITY = 82;

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"]);
const PRINT_SUFFIX = /\s*-\s*(afp|nafp)$/i;

// wild-nafp.png is an outdoor lifestyle photo ("DAY 1 - Wild") of the same
// physical drawing as Wild-nafp.jpg's clean scan, not a separate piece —
// skip it so "Wild" isn't listed twice.
const SKIP_FILES = new Set(["wild-nafp.png"]);

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
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function parseFilename(file) {
  const ext = extname(file);
  const stem = file.slice(0, -ext.length);
  const match = stem.match(PRINT_SUFFIX);
  if (!match) {
    throw new Error(
      `"${file}" has no -afp/-nafp suffix — every file in Drawings must end its name with -afp or -nafp before the extension.`
    );
  }
  return {
    title: titleCase(stem.slice(0, match.index)),
    availableForPrint: match[1].toLowerCase() === "afp",
  };
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

// Wipe everything currently in public/other-works and start clean.
if (existsSync(OUT_DIR)) {
  rmSync(OUT_DIR, { recursive: true, force: true });
}
mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(SOURCE, { withFileTypes: true })
  .filter(
    (f) =>
      f.isFile() &&
      IMAGE_EXTS.has(extname(f.name).toLowerCase()) &&
      !f.name.startsWith(".") &&
      !SKIP_FILES.has(f.name)
  )
  .map((f) => f.name);

const parsed = files
  .map((file) => ({ file, ...parseFilename(file) }))
  .sort((a, b) => a.title.localeCompare(b.title));

const seenSlugs = new Set();
const works = [];

parsed.forEach(({ file, title, availableForPrint }, i) => {
  const src = join(SOURCE, file);

  let slug = slugify(title);
  while (seenSlugs.has(slug)) slug = `${slug}-2`;
  seenSlugs.add(slug);

  // Convert into a throwaway name first, then rename to a content-hashed
  // filename. A plain numbered name (01.jpg, 02.jpg, ...) gets reused by a
  // *different* image every time the source folder changes, and browsers
  // cache by URL — so a stale cached "24.jpg" can silently keep showing old
  // artwork under a brand-new caption forever. Hashing the actual output
  // bytes into the filename means the URL itself changes whenever the
  // picture does, which makes that kind of stale-cache mismatch impossible.
  const tmpDest = join(OUT_DIR, `.tmp-${i}.jpg`);
  convertToJpeg(src, tmpDest);
  const hash = createHash("md5")
    .update(readFileSync(tmpDest))
    .digest("hex")
    .slice(0, 10);
  const destName = `${slug}-${hash}.jpg`;
  renameSync(tmpDest, join(OUT_DIR, destName));

  console.log(
    `  ${file} → other-works/${destName}  (${title}, ${
      availableForPrint ? "available for print" : "not available for print"
    })`
  );
  const { width, height } = getDimensions(join(OUT_DIR, destName));
  works.push({
    id: slug,
    title,
    availableForPrint,
    src: `/other-works/${destName}`,
    width,
    height,
  });
});

const ts = `export type OtherWork = {
  id: string;
  title: string;
  availableForPrint: boolean;
  src: string;
  width: number;
  height: number;
};

/**
 * Catalogue generated from the Drawings folder. Every source filename ends
 * in "-afp" (available for print) or "-nafp" (not available for print);
 * everything before that suffix becomes the title. Re-run
 * \`node scripts/import-other-works.mjs\` after adding, removing, or
 * renaming photos — it wipes and regenerates public/other-works from
 * scratch, so there's nothing hand-edited here to lose.
 */
export const otherWorks: OtherWork[] = ${JSON.stringify(works, null, 2)};
`;

writeFileSync(DATA_PATH, ts, "utf8");
console.log(`\nWrote ${works.length} other works → ${DATA_PATH}`);
