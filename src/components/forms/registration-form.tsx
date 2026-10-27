"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerForEvent, type FormState } from "@/app/actions/public";
import { SuccessPanel, Consent, FormAlert, GuardFields, SubmitButton, TextField } from "./fields";

const initial: FormState = { status: "idle" };

export function RegistrationForm({ eventId, token }: { eventId: string; token: string }) {
  const [state, action] = useActionState(registerForEvent.bind(null, eventId), initial);
  const v = state.values ?? {};
  const e = state.errors ?? {};

  if (state.status === "success") {
    return (
      <SuccessPanel className="border border-blue p-6">
        <p className="label text-blue">Registered</p>
        <p className="mt-3 text-[1.1rem] text-ink">{state.message}</p>
      </SuccessPanel>
    );
  }
  return (
    <form action={action} className="relative space-y-7" noValidate>
      <GuardFields token={token} />
      <FormAlert message={state.message} errors={state.errors} version={state} />
      <TextField name="name" label="Full name" required autoComplete="name" defaultValue={v.name} error={e.name} />
      <TextField name="email" type="email" label="Email" required autoComplete="email" defaultValue={v.email} error={e.email} />
      <TextField name="phone" type="tel" label="Phone" autoComplete="tel" defaultValue={v.phone} error={e.phone} />
      <TextField name="organisation" label="Organisation or institution" autoComplete="organization" defaultValue={v.organisation} error={e.organisation} />
      <Consent error={e.consent}>
        I agree to RS Foundation storing these details to manage this event, as described in the{" "}
        <Link href="/privacy" className="u-link-static">
          privacy policy
        </Link>
        .
      </Consent>
      <SubmitButton pendingLabel="Registering…">Register</SubmitButton>
    </form>
  );
}
