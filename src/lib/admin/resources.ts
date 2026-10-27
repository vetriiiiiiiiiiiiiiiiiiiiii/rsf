import { PROGRAM_ILLUSTRATIONS } from "@/components/art/program-glyph";
import { EVENT_CATEGORY_LABEL, PARTNER_KIND_LABEL } from "@/lib/site";

/**
 * Declarative description of each editable content type. Shared by the
 * server actions (validation, persistence) and the admin forms (rendering).
 * Must stay serialisable — no functions.
 */
export type FieldDef =
  | { name: string; label: string; type: "text" | "url"; required?: boolean; max?: number; help?: string }
  | { name: string; label: string; type: "textarea"; required?: boolean; max?: number; rows?: number; help?: string }
  | { name: string; label: string; type: "number"; required?: boolean; min?: number; max?: number; help?: string }
  | { name: string; label: string; type: "checkbox"; help?: string }
  | { name: string; label: string; type: "select"; required?: boolean; options: { value: string; label: string }[]; help?: string }
  | { name: string; label: string; type: "relation"; source: "categories"; help?: string }
  | { name: string; label: string; type: "datetime"; required?: boolean; help?: string }
  | { name: string; label: string; type: "image"; help?: string };

export type ColumnDef = { name: string; label: string; kind?: "status" | "date" | "bool" | "relation" | "enum" };

export type ResourceDef = {
  key: string;
  model: "startup" | "startupCategory" | "program" | "event" | "newsPost" | "person" | "partner";
  singular: string;
  plural: string;
  titleField: string;
  hasSlug: boolean;
  hasStatus: boolean;
  publicPath?: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  orderBy: Record<string, "asc" | "desc">[];
  enumLabels?: Record<string, Record<string, string>>;
};

const status: FieldDef = {
  name: "status",
  label: "Visibility",
  type: "select",
  required: true,
  options: [
    { value: "DRAFT", label: "Draft — hidden from the public site" },
    { value: "PUBLISHED", label: "Published" },
  ],
};
const slug: FieldDef = { name: "slug", label: "URL slug", type: "text", max: 80, help: "Leave empty to generate from the title." };
const order: FieldDef = { name: "order", label: "Sort order", type: "number", min: 0, max: 9999, help: "Lower numbers appear first." };

const opts = (labels: Record<string, string>) => Object.entries(labels).map(([value, label]) => ({ value, label }));

export const RESOURCES: ResourceDef[] = [
  {
    key: "startups",
    model: "startup",
    singular: "Startup",
    plural: "Startups",
    titleField: "name",
    hasSlug: true,
    hasStatus: true,
    publicPath: "/startups",
    fields: [
      { name: "name", label: "Venture name", type: "text", required: true, max: 120 },
      slug,
      { name: "tagline", label: "One-line description", type: "text", required: true, max: 160 },
      { name: "description", label: "Full description", type: "textarea", required: true, max: 6000, rows: 8, help: "Separate paragraphs with a blank line." },
      { name: "founders", label: "Founder names", type: "text", max: 300, help: "Only publish names the founders have approved." },
      { name: "categoryId", label: "Sector", type: "relation", source: "categories" },
      { name: "stage", label: "Stage", type: "text", max: 60 },
      { name: "foundedYear", label: "Year founded", type: "number", min: 1950, max: 2100 },
      { name: "location", label: "Location", type: "text", max: 120 },
      { name: "website", label: "Website", type: "url", max: 300 },
      { name: "imageId", label: "Product photograph", type: "image", help: "Without an image, a generated drawing is shown." },
      { name: "featured", label: "Feature in the archive", type: "checkbox" },
      order,
      status,
    ],
    columns: [
      { name: "name", label: "Name" },
      { name: "category", label: "Sector", kind: "relation" },
      { name: "featured", label: "Featured", kind: "bool" },
      { name: "status", label: "Status", kind: "status" },
      { name: "updatedAt", label: "Updated", kind: "date" },
    ],
    orderBy: [{ order: "asc" }, { name: "asc" }],
  },
  {
    key: "categories",
    model: "startupCategory",
    singular: "Category",
    plural: "Startup categories",
    titleField: "name",
    hasSlug: true,
    hasStatus: false,
    fields: [{ name: "name", label: "Category name", type: "text", required: true, max: 60 }, slug, order],
    columns: [
      { name: "name", label: "Name" },
      { name: "slug", label: "Slug" },
      { name: "order", label: "Order" },
    ],
    orderBy: [{ order: "asc" }, { name: "asc" }],
  },
  {
    key: "programs",
    model: "program",
    singular: "Programme",
    plural: "Programmes",
    titleField: "name",
    hasSlug: true,
    hasStatus: true,
    publicPath: "/incubation",
    fields: [
      { name: "name", label: "Programme name", type: "text", required: true, max: 120 },
      slug,
      { name: "summary", label: "Summary", type: "textarea", required: true, max: 400, rows: 3 },
      { name: "description", label: "Full description", type: "textarea", required: true, max: 8000, rows: 8 },
      { name: "audience", label: "Intended for / eligibility", type: "textarea", max: 600, rows: 3, help: "Leave empty until confirmed — the site shows it as pending." },
      { name: "duration", label: "Duration", type: "text", max: 120 },
      { name: "format", label: "Format", type: "text", max: 200 },
      { name: "illustration", label: "Illustration", type: "select", required: true, options: PROGRAM_ILLUSTRATIONS.map((v) => ({ value: v, label: v })) },
      { name: "provisional", label: "Proposed — awaiting confirmation", type: "checkbox", help: "Untick once the foundation has confirmed this programme." },
      { name: "acceptingApplications", label: "Accepting applications", type: "checkbox" },
      order,
      status,
    ],
    columns: [
      { name: "name", label: "Name" },
      { name: "provisional", label: "Proposed", kind: "bool" },
      { name: "acceptingApplications", label: "Open", kind: "bool" },
      { name: "status", label: "Status", kind: "status" },
      { name: "updatedAt", label: "Updated", kind: "date" },
    ],
    orderBy: [{ order: "asc" }],
  },
  {
    key: "events",
    model: "event",
    singular: "Event",
    plural: "Events",
    titleField: "title",
    hasSlug: true,
    hasStatus: true,
    publicPath: "/events",
    enumLabels: { category: EVENT_CATEGORY_LABEL },
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 160 },
      slug,
      { name: "category", label: "Type", type: "select", required: true, options: opts(EVENT_CATEGORY_LABEL) },
      { name: "summary", label: "Summary", type: "textarea", required: true, max: 400, rows: 3 },
      { name: "body", label: "Details", type: "textarea", required: true, max: 8000, rows: 8 },
      { name: "startsAt", label: "Starts (IST)", type: "datetime", required: true },
      { name: "endsAt", label: "Ends (IST)", type: "datetime" },
      { name: "location", label: "Location", type: "text", max: 200 },
      { name: "registrationOpen", label: "Registration open", type: "checkbox" },
      { name: "registrationUrl", label: "External registration link", type: "url", max: 300, help: "If empty and registration is open, the built-in form is used." },
      { name: "capacity", label: "Capacity", type: "number", min: 1, max: 100000 },
      { name: "imageId", label: "Image", type: "image" },
      status,
    ],
    columns: [
      { name: "title", label: "Title" },
      { name: "category", label: "Type", kind: "enum" },
      { name: "startsAt", label: "Date", kind: "date" },
      { name: "registrationOpen", label: "Registration", kind: "bool" },
      { name: "status", label: "Status", kind: "status" },
    ],
    orderBy: [{ startsAt: "desc" }],
  },
  {
    key: "news",
    model: "newsPost",
    singular: "Article",
    plural: "News",
    titleField: "title",
    hasSlug: true,
    hasStatus: true,
    publicPath: "/news",
    fields: [
      { name: "title", label: "Headline", type: "text", required: true, max: 160 },
      slug,
      { name: "excerpt", label: "Standfirst", type: "textarea", required: true, max: 400, rows: 3 },
      { name: "body", label: "Body", type: "textarea", required: true, max: 20000, rows: 14 },
      { name: "publishedAt", label: "Publication date (IST)", type: "datetime", required: true, help: "Future dates are scheduled — the article appears then." },
      { name: "imageId", label: "Image", type: "image" },
      status,
    ],
    columns: [
      { name: "title", label: "Headline" },
      { name: "publishedAt", label: "Date", kind: "date" },
      { name: "status", label: "Status", kind: "status" },
    ],
    orderBy: [{ publishedAt: "desc" }],
  },
  {
    key: "people",
    model: "person",
    singular: "Person",
    plural: "Leadership & mentors",
    titleField: "name",
    hasSlug: true,
    hasStatus: true,
    enumLabels: { kind: { LEADERSHIP: "Leadership", MENTOR: "Mentor" } },
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 120 },
      slug,
      { name: "kind", label: "Group", type: "select", required: true, options: [{ value: "LEADERSHIP", label: "Leadership" }, { value: "MENTOR", label: "Mentor" }] },
      { name: "role", label: "Role / designation", type: "text", required: true, max: 200, help: "Use the exact, approved designation." },
      { name: "bio", label: "Biography", type: "textarea", max: 4000, rows: 6, help: "Only verified, approved information." },
      { name: "expertise", label: "Areas of expertise", type: "text", max: 200 },
      { name: "linkedinUrl", label: "Professional profile URL", type: "url", max: 300 },
      { name: "websiteUrl", label: "Website", type: "url", max: 300 },
      { name: "imageId", label: "Portrait", type: "image", help: "Approved photograph only. Portrait orientation (4:5) works best." },
      order,
      status,
    ],
    columns: [
      { name: "name", label: "Name" },
      { name: "kind", label: "Group", kind: "enum" },
      { name: "role", label: "Role" },
      { name: "status", label: "Status", kind: "status" },
    ],
    orderBy: [{ kind: "asc" }, { order: "asc" }],
  },
  {
    key: "partners",
    model: "partner",
    singular: "Partner",
    plural: "Partners",
    titleField: "name",
    hasSlug: true,
    hasStatus: true,
    enumLabels: { kind: PARTNER_KIND_LABEL },
    fields: [
      { name: "name", label: "Organisation", type: "text", required: true, max: 160 },
      slug,
      { name: "kind", label: "Relationship", type: "select", required: true, options: opts(PARTNER_KIND_LABEL) },
      { name: "description", label: "Description", type: "textarea", max: 1000, rows: 3 },
      { name: "url", label: "Website", type: "url", max: 300 },
      { name: "logoId", label: "Logo", type: "image", help: "Only upload logos the organisation has approved for use." },
      order,
      status,
    ],
    columns: [
      { name: "name", label: "Organisation" },
      { name: "kind", label: "Relationship", kind: "enum" },
      { name: "status", label: "Status", kind: "status" },
    ],
    orderBy: [{ order: "asc" }, { name: "asc" }],
  },
];

export function getResource(key: string) {
  return RESOURCES.find((r) => r.key === key) ?? null;
}
