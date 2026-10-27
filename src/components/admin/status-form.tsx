"use client";

import { useActionState } from "react";
import type { AdminFormState } from "@/app/actions/admin";
import { SubmitButton } from "@/components/forms/fields";

export function StatusForm({
  action,
  statuses,
  status,
  notes,
  notesName,
  notesLabel = "Internal notes",
}: {
  action: (prev: AdminFormState, data: FormData) => Promise<AdminFormState>;
  statuses: { value: string; label: string }[];
  status: string;
  notes: string;
  notesName: string;
  notesLabel?: string;
}) {
  const [state, formAction] = useActionState(action, { status: "idle" } as AdminFormState);
  return (
    <form action={formAction} className="space-y-6">
      {state.message ? (
        <p role="status" className="border-l-2 border-blue bg-pale px-4 py-3 text-sm text-ink">
          {state.message}
        </p>
      ) : null}
      <div>
        <label htmlFor="status" className="text-[0.92rem] font-medium text-ink">
          Status
        </label>
        <select id="status" name="status" defaultValue={status} className="field-input">
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="notes" className="text-[0.92rem] font-medium text-ink">
          {notesLabel}
        </label>
        <textarea id="notes" name={notesName} defaultValue={notes} rows={6} maxLength={8000} className="field-input" />
        <p className="mt-1.5 text-xs text-muted">Visible only to administrators.</p>
      </div>
      <SubmitButton pendingLabel="Saving…">Save</SubmitButton>
    </form>
  );
}
