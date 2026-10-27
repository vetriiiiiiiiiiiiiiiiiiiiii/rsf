import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { Wordmark } from "@/components/layout/wordmark";
import { LoginForm } from "@/components/admin/login-form";
import { BrandLogo } from "@/components/layout/brand-logo";
import { hasLogo } from "@/lib/brand";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/asdfghjkl");
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="bp-grid relative hidden border-r border-rule bg-pale lg:block">
        <div className="absolute left-10 top-10">
          {hasLogo() ? <BrandLogo height={64} plate={false} /> : <Wordmark />}
        </div>
        <svg aria-hidden viewBox="0 0 400 400" className="absolute left-1/2 top-1/2 w-[60%] -translate-x-1/2 -translate-y-1/2" fill="none">
          <circle cx="200" cy="200" r="150" stroke="#2A3382" />
          <circle cx="200" cy="200" r="100" stroke="#5866B8" strokeDasharray="2 6" />
          <path d="M200 30V370M30 200H370" stroke="#E3E6F0" />
          <rect x="170" y="170" width="60" height="60" stroke="#1B2266" />
          <circle cx="200" cy="200" r="4" fill="#2A3382" />
        </svg>
        <p className="label absolute bottom-10 left-10 text-muted">Restricted area</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            {hasLogo() ? <BrandLogo height={52} plate={false} /> : <Wordmark />}
          </div>
          <p className="label mt-10 text-blue lg:mt-0">Administration</p>
          <h1 className="display-md mt-4 text-ink">Sign in</h1>
          <LoginForm />
          <p className="mt-10 text-sm text-muted">Access is restricted to authorised RS Foundation staff. Attempts are logged.</p>
        </div>
      </div>
    </main>
  );
}
