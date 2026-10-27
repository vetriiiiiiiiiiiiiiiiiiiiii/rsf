"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitApplication, type FormState } from "@/app/actions/public";
import { SuccessPanel, Consent, FileField, FormAlert, GuardFields, SelectField, SubmitButton, TextArea, TextField } from "./fields";
import { STAGES } from "@/lib/validation";

const initial: FormState = { status: "idle" };

const PARTS = [
  { id: "founder", n: "01", t: "Founder" },
  { id: "venture", n: "02", t: "Venture" },
  { id: "problem", n: "03", t: "Problem & solution" },
  { id: "team", n: "04", t: "Team" },
  { id: "support", n: "05", t: "Support & materials" },
  { id: "declaration", n: "06", t: "Declaration" },
];

function Part({ id, n, t, children }: { id: string; n: string; t: string; children: React.ReactNode }) {
  return (
    <fieldset id={id} className="grid scroll-mt-28 gap-8 border-t border-ink pt-6 md:grid-cols-[10rem_1fr]">
      <legend className="contents">
        <span className="flex items-baseline gap-3 md:flex-col md:gap-1">
          <span className="label text-blue">{n}</span>
          <span className="text-[1.15rem] font-semibold text-ink">{t}</span>
        </span>
      </legend>
      <div className="space-y-8">{children}</div>
    </fieldset>
  );
}

export function ApplicationForm({ token, programs, defaultProgram }: { token: string; programs: { slug: string; name: string }[]; defaultProgram?: string }) {
  const [state, action] = useActionState(submitApplication, initial);
  const v = state.values ?? {};
  const e = state.errors ?? {};

  if (state.status === "success" && state.reference) {
    return (
      <SuccessPanel className="relative border border-blue p-8 md:p-12">
        <span aria-hidden className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-blue" />
        <p className="label text-blue">Application received</p>
        <p className="display-md mt-5 text-ink">Thank you.</p>
        <p className="mt-5 max-w-[52ch] text-[1.05rem] leading-relaxed text-ink">
          Your application has been stored. Please keep your reference number — quote it in any correspondence about this application.
        </p>
        <p className="mt-8 inline-block border border-ink px-5 py-3 font-mono text-xl tracking-[0.08em] text-ink">{state.reference}</p>
        <p className="mt-8 text-sm text-muted">
          The RS Foundation team reviews each application. If you need to add anything, use the{" "}
          <Link href="/contact?type=FOUNDER" className="u-link-static">
            contact form
          </Link>{" "}
          with your reference.
        </p>
      </SuccessPanel>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[14rem_1fr]">
      <nav aria-label="Application sections" className="hidden lg:block">
        <ol className="sticky top-[calc(var(--header-h)+32px)] space-y-2 border-l border-rule pl-4">
          {PARTS.map((p) => (
            <li key={p.id}>
              <a href={`#${p.id}`} className="group flex gap-3 text-sm text-muted hover:text-ink">
                <span className="label-sm pt-[3px] text-blue">{p.n}</span>
                <span className="u-link">{p.t}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <form action={action} className="relative space-y-14" noValidate encType="multipart/form-data">
        <GuardFields token={token} />
        <FormAlert message={state.message} errors={state.errors} version={state} />

        <Part {...PARTS[0]}>
          <div className="grid gap-8 sm:grid-cols-2">
            <TextField name="founderName" label="Full name" required autoComplete="name" defaultValue={v.founderName} error={e.founderName} />
            <TextField name="email" type="email" label="Email" required autoComplete="email" defaultValue={v.email} error={e.email} />
            <TextField name="phone" type="tel" label="Phone" required autoComplete="tel" defaultValue={v.phone} error={e.phone} />
            <TextField name="city" label="City" autoComplete="address-level2" defaultValue={v.city} error={e.city} />
          </div>
          <TextField name="institution" label="Institution or organisation" hint="College, university or employer, if relevant." defaultValue={v.institution} error={e.institution} />
        </Part>

        <Part {...PARTS[1]}>
          <div className="grid gap-8 sm:grid-cols-2">
            <TextField name="ventureName" label="Venture name" required defaultValue={v.ventureName} error={e.ventureName} hint="A working name is fine." />
            <TextField name="sector" label="Sector" required defaultValue={v.sector} error={e.sector} hint="For example: agriculture, health, education, energy." />
            <SelectField name="stage" label="Current stage" required options={STAGES.map((s) => ({ value: s, label: s }))} defaultValue={v.stage} error={e.stage} />
            {programs.length ? (
              <SelectField
                name="programSlug"
                label="Programme of interest"
                options={programs.map((p) => ({ value: p.slug, label: p.name }))}
                defaultValue={v.programSlug ?? defaultProgram}
                placeholder="Not sure yet"
                error={e.programSlug}
              />
            ) : null}
          </div>
          <TextField name="website" label="Website or demo link" inputMode="url" defaultValue={v.website} error={e.website} />
        </Part>

        <Part {...PARTS[2]}>
          <TextArea name="problem" label="What problem are you solving, and for whom?" required rows={5} maxLength={3000} defaultValue={v.problem} error={e.problem} />
          <TextArea name="solution" label="How does your solution work, and what evidence do you have so far?" required rows={5} maxLength={3000} defaultValue={v.solution} error={e.solution} />
        </Part>

        <Part {...PARTS[3]}>
          <TextField name="teamSize" type="number" inputMode="numeric" label="Number of people in the team" required defaultValue={v.teamSize} error={e.teamSize} />
          <TextArea name="team" label="Who is on the team, and what does each person bring?" required rows={4} maxLength={3000} defaultValue={v.team} error={e.team} />
        </Part>

        <Part {...PARTS[4]}>
          <TextArea name="support" label="What support are you looking for from RS Foundation?" required rows={4} maxLength={3000} defaultValue={v.support} error={e.support} />
          <FileField name="pitchDeck" label="Pitch deck" accept="application/pdf" hint="PDF, up to 10 MB. Visible only to the review team." error={e.pitchDeck} />
        </Part>

        <Part {...PARTS[5]}>
          <Consent error={e.consent}>
            I confirm the information above is accurate, and I agree to RS Foundation storing and reviewing this application as described in the{" "}
            <Link href="/privacy" className="u-link-static">
              privacy policy
            </Link>
            .
          </Consent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SubmitButton pendingLabel="Submitting application…">Submit application</SubmitButton>
            <p className="text-sm text-muted">You will receive a reference number once it is saved.</p>
          </div>
        </Part>
      </form>
    </div>
  );
}
