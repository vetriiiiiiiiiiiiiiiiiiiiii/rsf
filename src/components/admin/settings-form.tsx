"use client";

import { useActionState } from "react";
import { saveSettings, type AdminFormState } from "@/app/actions/admin";
import { FormAlert, SubmitButton } from "@/components/forms/fields";

type Def = { key: string; label: string; group: string; multiline?: boolean; help?: string; fallback: string; value: string; stored: boolean };

export function SettingsForm({ defs }: { defs: Def[] }) {
  const [state, action] = useActionState(saveSettings, { status: "idle" } as AdminFormState);
  const groups = [...new Set(defs.map((d) => d.group))];
  const e = state.errors ?? {};
  return (
    <form action={action} className="max-w-3xl space-y-12">
      <FormAlert message={state.status === "error" ? state.message : undefined} errors={state.errors} version={state} />
      {state.status === "success" ? (
        <p role="status" className="border-l-2 border-blue bg-pale px-4 py-3 text-sm text-ink">
          {state.message}
        </p>
      ) : null}
      {groups.map((g) => (
        <fieldset key={g} className="space-y-7">
          <legend className="w-full border-b border-ink pb-2 font-semibold text-ink">{g}</legend>
          {defs
            .filter((d) => d.group === g)
            .map((d) => {
              const id = `s-${d.key}`;
              return (
                <div key={d.key}>
                  <label htmlFor={id} className="flex items-baseline justify-between gap-4">
                    <span className="text-[0.92rem] font-medium text-ink">{d.label}</span>
                    <span className="label-sm text-muted">{d.stored ? "Edited" : d.fallback ? "Default copy" : "Empty — shown as pending"}</span>
                  </label>
                  {d.multiline ? (
                    <textarea id={id} name={d.key} defaultValue={d.value} rows={d.key.includes("headline") ? 3 : 4} className="field-input" aria-invalid={e[d.key] ? true : undefined} />
                  ) : (
                    <input id={id} name={d.key} defaultValue={d.value} className="field-input" aria-invalid={e[d.key] ? true : undefined} />
                  )}
                  {d.help ? <p className="mt-1.5 text-xs text-muted">{d.help}</p> : null}
                  {e[d.key] ? <p className="mt-1.5 text-sm font-medium text-blue">{e[d.key]}</p> : null}
                </div>
              );
            })}
        </fieldset>
      ))}
      <div className="sticky bottom-0 border-t border-rule bg-white/95 py-4">
        <SubmitButton pendingLabel="Saving…">Save settings</SubmitButton>
      </div>
    </form>
  );
}
