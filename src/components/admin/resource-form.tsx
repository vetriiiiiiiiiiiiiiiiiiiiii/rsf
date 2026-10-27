"use client";

import { useActionState, useState } from "react";
import { saveResource, type AdminFormState } from "@/app/actions/admin";
import type { FieldDef } from "@/lib/admin/resources";
import { FormAlert, SubmitButton } from "@/components/forms/fields";

type Values = Record<string, string | boolean>;
type ImageOption = { id: string; name: string; alt: string };

const initial: AdminFormState = { status: "idle" };

function Label({ htmlFor, f }: { htmlFor: string; f: FieldDef }) {
  return (
    <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-4">
      <span className="text-[0.92rem] font-medium text-ink">{f.label}</span>
      {"required" in f && f.required ? <span className="label-sm text-muted">Required</span> : null}
    </label>
  );
}

function ImageField({ f, value, images, error }: { f: FieldDef; value: string; images: ImageOption[]; error?: string }) {
  const [selected, setSelected] = useState(value);
  const id = `f-${f.name}`;
  return (
    <fieldset className="border border-rule p-4">
      <legend className="px-1 text-[0.92rem] font-medium text-ink">{f.label}</legend>
      <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
        <div className="relative aspect-square overflow-hidden border border-rule bg-pale">
          {selected ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded asset
            <img src={`/media/${selected}`} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="label-sm absolute inset-0 grid place-items-center text-muted">No image</span>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor={id} className="label text-muted">
              From library
            </label>
            <select id={id} name={f.name} value={selected} onChange={(e) => setSelected(e.target.value)} className="field-input">
              <option value="">— None —</option>
              {images.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                  {i.alt ? ` — ${i.alt}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-file`} className="label text-muted">
              Or upload new (PNG, JPEG, WebP · max 8 MB)
            </label>
            <input id={`${id}-file`} name={`${f.name}__file`} type="file" accept="image/png,image/jpeg,image/webp" className="mt-2 block w-full text-sm file:mr-3 file:border file:border-ink file:bg-white file:px-3 file:py-1.5 file:text-sm" />
            <input name={`${f.name}__alt`} placeholder="Alt text for the new image" aria-label="Alt text for the new image" className="field-input mt-2 !text-sm" />
          </div>
        </div>
      </div>
      {f.help ? <p className="mt-3 text-xs text-muted">{f.help}</p> : null}
      {error ? <p className="mt-2 text-sm font-medium text-blue">{error}</p> : null}
    </fieldset>
  );
}

export function ResourceForm({
  resourceKey,
  id,
  fields,
  values,
  categories,
  images,
  singular,
}: {
  resourceKey: string;
  id: string | null;
  fields: FieldDef[];
  values: Values;
  categories: { id: string; name: string }[];
  images: ImageOption[];
  singular: string;
}) {
  const [state, action] = useActionState(saveResource.bind(null, resourceKey, id), initial);
  const e = state.errors ?? {};

  return (
    <form action={action} className="max-w-3xl space-y-7" noValidate>
      <FormAlert message={state.status === "error" ? state.message : undefined} errors={state.errors} version={state} />
      {state.status === "success" ? (
        <p role="status" className="border-l-2 border-blue bg-pale px-4 py-3 text-sm text-ink">
          {state.message}
        </p>
      ) : null}

      {fields.map((f) => {
        const fid = `f-${f.name}`;
        const v = values[f.name];
        const err = e[f.name];
        const describe = err ? `${fid}-err` : f.help ? `${fid}-help` : undefined;
        const common = { id: fid, name: f.name, "aria-invalid": err ? true : undefined, "aria-describedby": describe };
        const help = f.help && f.type !== "image" ? <p id={`${fid}-help`} className="mt-1.5 text-xs text-muted">{f.help}</p> : null;
        const errNode = err && f.type !== "image" ? <p id={`${fid}-err`} className="mt-1.5 text-sm font-medium text-blue">{err}</p> : null;

        switch (f.type) {
          case "checkbox":
            return (
              <div key={f.name}>
                <label className="flex items-center gap-3 text-[0.92rem] text-ink">
                  <input type="checkbox" {...common} defaultChecked={v === true} className="choice" />
                  {f.label}
                </label>
                {help}
              </div>
            );
          case "textarea":
            return (
              <div key={f.name}>
                <Label htmlFor={fid} f={f} />
                <textarea {...common} rows={f.rows ?? 4} maxLength={f.max} defaultValue={String(v ?? "")} className="field-input" />
                {help}
                {errNode}
              </div>
            );
          case "select":
            return (
              <div key={f.name}>
                <Label htmlFor={fid} f={f} />
                <select {...common} defaultValue={String(v ?? f.options[0]?.value ?? "")} className="field-input">
                  {!f.required ? <option value="">—</option> : null}
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {help}
                {errNode}
              </div>
            );
          case "relation":
            return (
              <div key={f.name}>
                <Label htmlFor={fid} f={f} />
                <select {...common} defaultValue={String(v ?? "")} className="field-input">
                  <option value="">— None —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 ? <p className="mt-1.5 text-xs text-muted">Create categories under “Startup categories” first.</p> : help}
                {errNode}
              </div>
            );
          case "image":
            return <ImageField key={f.name} f={f} value={String(v ?? "")} images={images} error={err} />;
          case "datetime":
            return (
              <div key={f.name}>
                <Label htmlFor={fid} f={f} />
                <input type="datetime-local" {...common} defaultValue={String(v ?? "")} className="field-input" />
                {help}
                {errNode}
              </div>
            );
          default:
            return (
              <div key={f.name}>
                <Label htmlFor={fid} f={f} />
                <input
                  type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                  {...common}
                  defaultValue={String(v ?? "")}
                  maxLength={"max" in f && f.type !== "number" ? f.max : undefined}
                  className="field-input"
                />
                {help}
                {errNode}
              </div>
            );
        }
      })}

      <div className="sticky bottom-0 -mx-1 flex items-center gap-4 border-t border-rule bg-white/95 px-1 py-4">
        <SubmitButton pendingLabel="Saving…">{id ? `Save ${singular.toLowerCase()}` : `Create ${singular.toLowerCase()}`}</SubmitButton>
      </div>
    </form>
  );
}
