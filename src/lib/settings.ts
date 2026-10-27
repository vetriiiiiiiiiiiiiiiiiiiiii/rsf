import "server-only";
import { cache } from "react";
import { db } from "./db";

type SettingDef = {
  label: string;
  group: "Homepage" | "About" | "Contact" | "Social" | "Institution";
  multiline?: boolean;
  help?: string;
  /** Provisional copy shown until the foundation edits it. Empty means "must be supplied". */
  fallback: string;
};

/**
 * Every editable site-wide value. Facts about the institution (vision, mission,
 * contact details, social accounts) intentionally ship empty: the public site
 * renders a visible "awaiting approved content" marker until they are supplied.
 */
export const SETTINGS = {
  "hero.eyebrow": { group: "Homepage", label: "Hero identifier", fallback: "R Shivakumar Foundation / Innovation & Incubation" },
  "hero.headline": {
    group: "Homepage",
    label: "Hero headline",
    multiline: true,
    help: "One line per row. Wrap a word in *asterisks* to set it in the italic serif.",
    fallback: "Ideas are\nonly the\n*beginning.*",
  },
  "hero.body": {
    group: "Homepage",
    label: "Hero supporting copy",
    multiline: true,
    fallback:
      "RS Foundation is an innovation and incubation centre that works alongside founders, students and researchers — helping them question an idea, test it, build it and shape it into a venture that can stand on its own.",
  },
  "about.intro": {
    group: "About",
    label: "Introduction",
    multiline: true,
    fallback:
      "RS Foundation exists to give early ideas the structure they need to become real ventures: space to experiment, people who have built before, and a deliberate path from first question to first customer.",
  },
  "about.vision": { group: "About", label: "Vision statement", multiline: true, fallback: "" },
  "about.mission": { group: "About", label: "Mission statement", multiline: true, fallback: "" },
  "closing.headline": {
    group: "Homepage",
    label: "Closing headline",
    multiline: true,
    fallback: "Your next chapter\nstarts with a\n*conversation.*",
  },
  "institution.association": {
    group: "Institution",
    label: "Institutional association",
    multiline: true,
    help: "Exact wording approved by the institution.",
    fallback:
      "An incubation centre associated with R. Sivakumar, Chairman of SRM Institute of Science and Technology, Tiruchirappalli.",
  },
  "contact.email": { group: "Contact", label: "Email address", fallback: "" },
  "contact.phone": { group: "Contact", label: "Phone number", fallback: "" },
  "contact.address": { group: "Contact", label: "Postal address", multiline: true, fallback: "" },
  "contact.hours": { group: "Contact", label: "Visiting hours", fallback: "" },
  "contact.mapUrl": { group: "Contact", label: "Map link (URL)", fallback: "" },
  "social.linkedin": { group: "Social", label: "LinkedIn URL", fallback: "" },
  "social.instagram": { group: "Social", label: "Instagram URL", fallback: "" },
  "social.x": { group: "Social", label: "X (Twitter) URL", fallback: "" },
  "social.youtube": { group: "Social", label: "YouTube URL", fallback: "" },
} satisfies Record<string, SettingDef>;

export type SettingKey = keyof typeof SETTINGS;
export type SiteSettings = Record<SettingKey, string>;

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await db.setting.findMany();
  const stored = new Map(rows.map((r) => [r.key, r.value]));
  const out = {} as SiteSettings;
  for (const [key, def] of Object.entries(SETTINGS) as [SettingKey, SettingDef][]) {
    out[key] = stored.get(key) ?? def.fallback;
  }
  return out;
});
