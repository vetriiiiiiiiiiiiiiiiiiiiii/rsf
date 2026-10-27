"use client";

import { useActionState } from "react";
import { login, type AuthState } from "@/app/actions/auth";
import { SubmitButton, TextField } from "@/components/forms/fields";

export function LoginForm() {
  const [state, action] = useActionState(login, {} as AuthState);
  return (
    <form action={action} className="mt-10 space-y-7">
      {state.error ? (
        <p role="alert" className="border-l-2 border-blue bg-pale px-4 py-3 text-sm text-ink">
          {state.error}
        </p>
      ) : null}
      <TextField name="email" type="email" label="Email" required autoComplete="username" defaultValue={state.email} />
      <TextField name="password" type="password" label="Password" required autoComplete="current-password" />
      <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
    </form>
  );
}
