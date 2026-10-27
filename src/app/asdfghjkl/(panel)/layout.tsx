import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { logout } from "@/app/actions/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { Wordmark } from "@/components/layout/wordmark";
import { RESOURCES } from "@/lib/admin/resources";
import { BrandLogo } from "@/components/layout/brand-logo";
import { hasLogo } from "@/lib/brand";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const [newInquiries, newApplications] = await Promise.all([
    db.inquiry.count({ where: { status: "NEW" } }),
    db.application.count({ where: { status: "SUBMITTED" } }),
  ]);

  const groups = [
    { title: "Overview", items: [{ href: "/asdfghjkl", label: "Dashboard" }] },
    {
      title: "Submissions",
      items: [
        { href: "/asdfghjkl/applications", label: "Applications", badge: newApplications },
        { href: "/asdfghjkl/inquiries", label: "Enquiries", badge: newInquiries },
      ],
    },
    { title: "Content", items: RESOURCES.map((r) => ({ href: `/asdfghjkl/content/${r.key}`, label: r.plural })) },
    {
      title: "Site",
      items: [
        { href: "/asdfghjkl/media", label: "Media library" },
        { href: "/asdfghjkl/settings", label: "Homepage & contact" },
        { href: "/asdfghjkl/account", label: admin.role === "ADMIN" ? "Account & users" : "Account" },
      ],
    },
  ];

  return (
    <div className="grid min-h-dvh lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-rule bg-pale px-5 py-5 lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 lg:block">
          <Link href="/asdfghjkl" aria-label="Dashboard">
            {hasLogo() ? <BrandLogo height={40} /> : <Wordmark />}
          </Link>
          <p className="label-sm mt-2 hidden text-blue lg:block">Administration</p>
          <AdminNav groups={groups} />
        </div>
        <div className="mt-10 hidden border-t border-rule pt-4 lg:block">
          <p className="text-sm font-medium text-ink">{admin.name}</p>
          <p className="truncate text-xs text-muted">{admin.email}</p>
          <p className="label-sm mt-1 text-muted">{admin.role}</p>
          <div className="mt-4 flex gap-4">
            <form action={logout}>
              <button type="submit" className="label u-link-static text-ink">
                Sign out
              </button>
            </form>
            <Link href="/" target="_blank" className="label u-link-static text-muted">
              View site ↗
            </Link>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="flex items-center justify-end gap-4 border-b border-rule px-5 py-2 lg:hidden">
          <form action={logout}>
            <button type="submit" className="label u-link-static text-ink">
              Sign out
            </button>
          </form>
        </div>
        <main id="main" className="px-5 py-8 md:px-10 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
