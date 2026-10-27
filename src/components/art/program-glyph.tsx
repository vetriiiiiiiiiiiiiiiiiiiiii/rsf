import { ContentIcon, type IconName } from "./content-icons";

export const PROGRAM_ILLUSTRATIONS = [
  "validation",
  "pre-incubation",
  "incubation",
  "product",
  "business-model",
  "mentorship",
  "investor",
  "industry",
] as const;
export type ProgramIllustration = (typeof PROGRAM_ILLUSTRATIONS)[number];

const ICON: Record<string, IconName> = {
  validation: "search",
  "pre-incubation": "seedling",
  incubation: "incubator",
  product: "product",
  "business-model": "canvas",
  mentorship: "mentor",
  investor: "investor",
  industry: "industry",
};

/** Programme plate: the programme's illustration centred on a quiet tinted ground. */
export function ProgramGlyph({ kind, label, className = "" }: { kind: string; label?: string; className?: string }) {
  return (
    <div className={`relative grid place-items-center bg-pale ${className}`} role={label ? "img" : undefined} aria-label={label}>
      <span aria-hidden className="absolute inset-[12%] rounded-full border border-rule" />
      <span aria-hidden className="absolute inset-[24%] rounded-full bg-white" />
      <ContentIcon name={ICON[kind] ?? "idea"} className="relative w-[44%]" />
    </div>
  );
}
