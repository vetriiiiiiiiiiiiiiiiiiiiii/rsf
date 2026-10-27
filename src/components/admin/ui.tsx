import Link from "next/link";

export function AdminHeader({ title, kicker, actions, children }: { title: string; kicker?: string; actions?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-ink pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        {kicker ? <p className="label text-blue">{kicker}</p> : null}
        <h1 className="mt-2 text-[clamp(1.6rem,2.6vw,2.3rem)] font-normal text-ink">{title}</h1>
        {children ? <div className="mt-2 max-w-[70ch] text-sm text-muted">{children}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}

export function AdminButton({ href, children, variant = "solid" }: { href: string; children: React.ReactNode; variant?: "solid" | "line" }) {
  return (
    <Link
      href={href}
      className={
        variant === "solid"
          ? "inline-flex items-center gap-2 bg-blue px-4 py-2.5 text-sm font-medium text-white hover:bg-ink"
          : "inline-flex items-center gap-2 border border-ink px-4 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-white"
      }
    >
      {children}
    </Link>
  );
}

export function StatusTag({ value, label }: { value: string; label?: string }) {
  const tone =
    value === "PUBLISHED" || value === "ACCEPTED" || value === "RESOLVED"
      ? "border-blue bg-blue text-white"
      : value === "NEW" || value === "SUBMITTED"
        ? "border-blue text-blue"
        : value === "DECLINED" || value === "ARCHIVED" || value === "WITHDRAWN"
          ? "border-rule text-muted"
          : "border-ink/40 text-ink";
  return <span className={`label-sm inline-block whitespace-nowrap border px-1.5 py-0.5 ${tone}`}>{label ?? value.replace(/_/g, " ")}</span>;
}

export function Notice({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "success" }) {
  return (
    <p role="status" className={`mb-6 border-l-2 px-4 py-3 text-sm ${tone === "success" ? "border-blue bg-pale text-ink" : "border-accent bg-white text-ink"}`}>
      {children}
    </p>
  );
}

export function Empty({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="border border-dashed border-rule px-6 py-12 text-center">
      <p className="font-semibold text-ink">{title}</p>
      {children ? <div className="mt-2 text-sm text-muted">{children}</div> : null}
    </div>
  );
}
