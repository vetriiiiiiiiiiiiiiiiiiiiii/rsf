import { ContentIcon } from "./content-icons";

/** Placeholder image for a venture without an approved photograph: its initials beside a growth illustration. */
export function StartupPlate({ name, className = "" }: { name: string; className?: string; ratio?: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div aria-hidden className={`relative flex flex-col justify-between bg-pale p-6 ${className}`}>
      <ContentIcon name="grow" className="w-16" />
      <span className="font-[family-name:var(--font-display)] text-6xl text-ink">{initials}</span>
    </div>
  );
}
