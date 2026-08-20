import { otherWorks, type OtherWork } from "@/lib/otherWorks";

/**
 * Titles highlighted on the Works (Paintings) page's Featured Other Works
 * section, in display order. They also still appear in the regular Other
 * Works listing — this is a spotlight, not a filter. This file is
 * hand-maintained — unlike otherWorks.ts, it is never overwritten by
 * scripts/import-other-works.mjs, so it's safe to edit directly when the
 * featured selection changes.
 */
const FEATURED_TITLES = ["Self Portrait 2021", "Glitch", "Green Sweater"];

export const featuredOtherWorks: OtherWork[] = FEATURED_TITLES.map((title) =>
  otherWorks.find((work) => work.title === title)
).filter((work): work is OtherWork => Boolean(work));
