import { InView } from "@/components/motion/in-view";
import { MaskedLines } from "./emphasis";

/** Section label (with the gold rule) and a serif headline. */
export function SectionHead({
  index,
  label,
  title,
  as: Tag = "h2",
  size = "display-lg",
  className = "",
  children,
  id,
}: {
  id?: string;
  index: string;
  label: string;
  title: string;
  as?: "h1" | "h2";
  size?: "display-xl" | "display-lg" | "display-md";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <InView data-reveal className={className}>
      <p className="label flex items-center gap-4 text-blue">
        <span aria-hidden className="gold-rule" />
        {label}
      </p>
      <Tag id={id ?? `s${index}-title`} className={`${size} mt-6 text-ink`}>
        <MaskedLines text={title} />
      </Tag>
      {children ? <div className="reveal-fade mt-6">{children}</div> : null}
    </InView>
  );
}
