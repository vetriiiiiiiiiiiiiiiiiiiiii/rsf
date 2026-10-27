import { ContentIcon, type IconName } from "./content-icons";

const STAGE_ICONS: IconName[] = ["question", "experiment", "build", "validate", "grow"];

/** Illustration for each stage of incubation: question → experiment → build → validate → grow. */
export function StageGlyph({ stage, className = "" }: { stage: number; className?: string }) {
  return <ContentIcon name={STAGE_ICONS[stage] ?? "idea"} className={className} />;
}
