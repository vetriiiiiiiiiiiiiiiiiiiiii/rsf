import { SITE, type SiteSettings } from "@/content";

export type { SiteSettings };
export type SettingKey = keyof SiteSettings;

/** Site-wide text and contact details, from src/content. */
export const getSettings = (): SiteSettings => SITE;
