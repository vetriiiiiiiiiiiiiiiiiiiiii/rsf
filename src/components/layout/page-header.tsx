import Link from "next/link";
import { InView } from "@/components/motion/in-view";
import { MaskedLines } from "@/components/ui/emphasis";

export function Breadcrumb({ trail }: { trail: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="label u-link text-muted">
            Index
          </Link>
        </li>
        {trail.map((t, i) => (
          <li key={i} className="flex items-center gap-2">
            <span aria-hidden className="label text-rule">/</span>
            {t.href ? (
              <Link href={t.href} className="label u-link text-muted">
                {t.label}
              </Link>
            ) : (
              <span aria-current="page" className="label text-blue">
                {t.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Opening band for interior pages: quiet navy ground, label, serif title, optional aside. */
export function PageHeader({
  label,
  title,
  intro,
  aside,
  trail,
  variant = "split",
}: {
  index?: string;
  label: string;
  title: string;
  intro?: React.ReactNode;
  aside?: React.ReactNode;
  trail: { href?: string; label: string }[];
  variant?: "split" | "stacked";
}) {
  return (
    <header className="on-dark blueprint-ground relative">
      <div className="shell relative border-b border-rule py-3">
        <Breadcrumb trail={trail} />
      </div>
      <InView data-reveal className="shell relative grid-12 gap-y-10 pb-20 pt-16 md:pb-24 md:pt-20">
        <div className={`col-span-12 ${variant === "split" && aside ? "lg:col-span-7" : "lg:col-span-9"}`}>
          <p className="label flex items-center gap-4 text-blue">
            <span aria-hidden className="gold-rule" />
            {label}
          </p>
          <h1 className="mt-7 text-[clamp(2.6rem,5.4vw,5rem)] font-normal leading-[1.04] text-ink [&_em]:text-white/85">
            <MaskedLines text={title} />
          </h1>
          {intro ? <div className="reveal-fade mt-7 max-w-[48ch] text-[1.1rem] leading-relaxed text-ink">{intro}</div> : null}
        </div>
        {aside ? <div className="reveal-fade col-span-12 sm:col-span-8 lg:col-span-4 lg:col-start-9 lg:self-end">{aside}</div> : null}
      </InView>
    </header>
  );
}

export function Facts({ items }: { items: { k: string; v: React.ReactNode }[] }) {
  return (
    <dl className="border-t border-ink">
      {items.map((i) => (
        <div key={i.k} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-rule py-3">
          <dt className="label pt-[3px] text-muted">{i.k}</dt>
          <dd className="text-[0.95rem] text-ink">{i.v}</dd>
        </div>
      ))}
    </dl>
  );
}

