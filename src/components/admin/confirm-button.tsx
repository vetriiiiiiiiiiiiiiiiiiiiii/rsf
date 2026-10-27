"use client";

import { useFormStatus } from "react-dom";

/** A submit button that asks for confirmation before destructive actions. */
export function ConfirmButton({ message, children, className = "" }: { message: string; children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={className || "label border border-ink/40 px-3 py-2 text-ink hover:border-ink hover:bg-ink hover:text-white disabled:opacity-50"}
    >
      {pending ? "Working…" : children}
    </button>
  );
}

export function PlainSubmit({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className || "label border border-ink/40 px-3 py-2 text-ink hover:border-ink disabled:opacity-50"}>
      {pending ? "…" : children}
    </button>
  );
}
