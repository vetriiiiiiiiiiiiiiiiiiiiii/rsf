"use client";

import { useActionState } from "react";
import { submitInquiry, type FormState } from "@/app/actions/public";
import { SuccessPanel, Consent, FormAlert, GuardFields, SelectField, SubmitButton, TextArea, TextField } from "./fields";
import { INQUIRY_TYPE_LABEL } from "@/lib/site";
import Link from "next/link";

const initial: FormState = { status: "idle" };

export function InquiryForm({ token, defaultType = "GENERAL", types }: { token: string; defaultType?: string; types?: string[] }) {
  const [state, action] = useActionState(submitInquiry, initial);
  const v = state.values ?? {};
  const e = state.errors ?? {};
  const options = (types ?? Object.keys(INQUIRY_TYPE_LABEL)).map((k) => ({ value: k, label: INQUIRY_TYPE_LABEL[k] }));

  if (state.status === "success") {
    return (
      <SuccessPanel className="border border-blue p-6 md:p-8">
        <p className="label text-blue">Received</p>
        <p className="display-sm mt-3 text-ink">{state.message}</p>
        <p className="mt-3 text-muted">Your message is stored securely and will be read by the RS Foundation team.</p>
      </SuccessPanel>
    );
  }

  return (
    <form action={action} className="relative space-y-8" noValidate>
      <GuardFields token={token} />
      <FormAlert message={state.message} errors={state.errors} version={state} />
      {options.length > 1 ? (
        <SelectField name="type" label="I am writing as" required options={options} defaultValue={v.type ?? defaultType} error={e.type} />
      ) : (
        <input type="hidden" name="type" value={options[0]?.value ?? "GENERAL"} />
      )}
      <div className="grid gap-8 sm:grid-cols-2">
        <TextField name="name" label="Full name" required autoComplete="name" defaultValue={v.name} error={e.name} />
        <TextField name="email" type="email" label="Email" required autoComplete="email" inputMode="email" defaultValue={v.email} error={e.email} />
        <TextField name="phone" type="tel" label="Phone" autoComplete="tel" inputMode="tel" defaultValue={v.phone} error={e.phone} />
        <TextField name="organisation" label="Organisation" autoComplete="organization" defaultValue={v.organisation} error={e.organisation} />
      </div>
      <TextArea name="message" label="Message" required rows={6} maxLength={4000} defaultValue={v.message} error={e.message} hint="What would you like to discuss?" />
      <Consent error={e.consent}>
        I agree to RS Foundation storing these details to respond to my enquiry, as described in the{" "}
        <Link href="/privacy" className="u-link-static">
          privacy policy
        </Link>
        .
      </Consent>
      <SubmitButton>Send message</SubmitButton>
    </form>
  );
}
