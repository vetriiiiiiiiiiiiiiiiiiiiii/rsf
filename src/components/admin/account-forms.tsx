"use client";

import { useActionState } from "react";
import { changePassword, type AuthState } from "@/app/actions/auth";
import { createUser, type AdminFormState } from "@/app/actions/admin";
import { FormAlert, SelectField, SubmitButton, TextField } from "@/components/forms/fields";

export function PasswordForm() {
  const [state, action] = useActionState(changePassword, {} as AuthState);
  const e = state.errors ?? {};
  return (
    <form action={action} className="max-w-md space-y-6">
      {state.ok ? (
        <p role="status" className="border-l-2 border-blue bg-pale px-4 py-3 text-sm text-ink">
          Password changed. Other sessions have been signed out.
        </p>
      ) : null}
      <TextField name="current" type="password" label="Current password" required autoComplete="current-password" error={e.current} />
      <TextField name="next" type="password" label="New password" required autoComplete="new-password" hint="At least 12 characters, with letters and a number." error={e.next} />
      <TextField name="confirm" type="password" label="Confirm new password" required autoComplete="new-password" error={e.confirm} />
      <SubmitButton pendingLabel="Saving…">Change password</SubmitButton>
    </form>
  );
}

export function NewUserForm() {
  const [state, action] = useActionState(createUser, { status: "idle" } as AdminFormState);
  const e = state.errors ?? {};
  return (
    <form action={action} className="max-w-md space-y-6">
      <FormAlert message={state.status === "error" ? state.message : undefined} errors={state.errors} version={state} />
      {state.status === "success" ? (
        <p role="status" className="border-l-2 border-blue bg-pale px-4 py-3 text-sm text-ink">
          {state.message}
        </p>
      ) : null}
      <TextField name="name" label="Name" required error={e.name} />
      <TextField name="email" type="email" label="Email" required autoComplete="off" error={e.email} />
      <SelectField
        name="role"
        label="Role"
        required
        defaultValue="EDITOR"
        options={[
          { value: "EDITOR", label: "Editor — content and submissions" },
          { value: "ADMIN", label: "Administrator — also users and deletions" },
        ]}
        error={e.role}
      />
      <TextField name="password" type="password" label="Temporary password" required autoComplete="new-password" hint="Share it securely; ask them to change it after signing in." error={e.password} />
      <SubmitButton pendingLabel="Creating…">Create user</SubmitButton>
    </form>
  );
}
