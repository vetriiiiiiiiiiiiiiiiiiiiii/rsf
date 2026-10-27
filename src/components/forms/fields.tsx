"use client";

import { useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Arrow } from "@/components/ui/arrow-link";

type Base = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

function FieldShell({ id, label, hint, error, required, className = "", children }: Base & { id: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-4">
        <span className="text-[0.95rem] font-medium text-ink">{label}</span>
        <span className="label-sm text-muted">{required ? "Required" : "Optional"}</span>
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-2 text-sm font-medium text-blue">
          <span aria-hidden className="label-sm mt-[3px] border border-blue px-1">!</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function TextField({
  type = "text",
  defaultValue,
  autoComplete,
  inputMode,
  placeholder,
  ...props
}: Base & { type?: string; defaultValue?: string; autoComplete?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; placeholder?: string }) {
  const id = useId();
  return (
    <FieldShell id={id} {...props}>
      <input
        id={id}
        name={props.name}
        type={type}
        defaultValue={defaultValue}
        required={props.required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(id, props.hint, props.error)}
        className="field-input"
      />
    </FieldShell>
  );
}

export function TextArea({ defaultValue, rows = 4, maxLength, ...props }: Base & { defaultValue?: string; rows?: number; maxLength?: number }) {
  const id = useId();
  return (
    <FieldShell id={id} {...props}>
      <textarea
        id={id}
        name={props.name}
        rows={rows}
        defaultValue={defaultValue}
        required={props.required}
        maxLength={maxLength}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(id, props.hint, props.error)}
        className="field-input"
      />
    </FieldShell>
  );
}

export function SelectField({
  options,
  defaultValue,
  placeholder = "Select…",
  ...props
}: Base & { options: { value: string; label: string }[]; defaultValue?: string; placeholder?: string }) {
  const id = useId();
  return (
    <FieldShell id={id} {...props}>
      <select
        id={id}
        name={props.name}
        defaultValue={defaultValue ?? ""}
        required={props.required}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(id, props.hint, props.error)}
        className="field-input"
      >
        <option value="" disabled={props.required}>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function FileField({ accept, ...props }: Base & { accept: string }) {
  const id = useId();
  return (
    <FieldShell id={id} {...props}>
      <input
        id={id}
        name={props.name}
        type="file"
        accept={accept}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(id, props.hint, props.error)}
        className="mt-3 block w-full text-sm text-muted file:mr-4 file:cursor-pointer file:border file:border-ink file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-pale"
      />
    </FieldShell>
  );
}

export function Consent({ name = "consent", error, children, defaultChecked }: { name?: string; error?: string; children: React.ReactNode; defaultChecked?: boolean }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          required
          defaultChecked={defaultChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="choice mt-1 shrink-0"
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-ink">
          {children}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 pl-7 text-sm font-medium text-blue">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Honeypot field: hidden from people, filled in by spam bots. */
export function GuardFields() {
  return (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
    </>
  );
}

export function SubmitButton({ children, pendingLabel = "Sending…" }: { children: React.ReactNode; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="group inline-flex items-center gap-4 bg-blue px-6 py-4 font-medium text-white transition-colors hover:bg-ink disabled:cursor-progress disabled:bg-muted"
    >
      {pending ? pendingLabel : children}
      {pending ? <span aria-hidden className="caret inline-block h-4 w-[2px] bg-white" /> : <Arrow />}
    </button>
  );
}

/** Announces form-level errors and moves focus to them so keyboard and screen-reader users notice. */
export function FormAlert({ message, errors, version }: { message?: string; errors?: Record<string, string>; version: unknown }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (message) ref.current?.focus();
  }, [message, version]);
  if (!message) return null;
  const count = errors ? Object.keys(errors).length : 0;
  return (
    <div ref={ref} tabIndex={-1} role="alert" className="border-l-2 border-blue bg-pale px-5 py-4 outline-none">
      <p className="font-medium text-ink">{message}</p>
      {count ? (
        <p className="mt-1 text-sm text-muted">
          {count} {count === 1 ? "field needs" : "fields need"} attention.
        </p>
      ) : null}
    </div>
  );
}

/** Success panel that takes focus and scrolls into view, since the form it replaces may have been much taller. */
export function SuccessPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    ref.current?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, []);
  return (
    <div ref={ref} tabIndex={-1} role="status" className={`outline-none ${className}`}>
      {children}
    </div>
  );
}
