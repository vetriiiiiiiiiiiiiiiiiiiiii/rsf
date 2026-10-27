import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/format";
import { AdminHeader, Notice, StatusTag } from "@/components/admin/ui";
import { APPLICATION_STATUS_LABEL, INQUIRY_TYPE_LABEL } from "@/lib/site";

export const metadata = { title: "Dashboard" };

export default async function Dashboard({ searchParams }: PageProps<"/asdfghjkl">) {
  const admin = await requireAdmin();
  const sp = await searchParams;
  const [s, counts, applications, inquiries, activity, leaders, provisional] = await Promise.all([
    getSettings(),
    Promise.all([
      db.application.count(),
      db.application.count({ where: { status: "SUBMITTED" } }),
      db.inquiry.count({ where: { status: "NEW" } }),
      db.startup.count({ where: { status: "PUBLISHED" } }),
      db.event.count({ where: { status: "PUBLISHED", startsAt: { gte: new Date() } } }),
      db.person.count({ where: { status: "PUBLISHED", kind: "MENTOR" } }),
    ]),
    db.application.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 12, include: { user: { select: { name: true } } } }),
    db.person.findMany({ where: { kind: "LEADERSHIP" } }),
    db.program.count({ where: { provisional: true, status: "PUBLISHED" } }),
  ]);
  const [appsTotal, appsNew, inqNew, startups, upcoming, mentors] = counts;

  // Pre-launch checklist: every item is derived from real data.
  const checklist = [
    { done: Boolean(s["about.vision"]), label: "Vision statement", href: "/asdfghjkl/settings" },
    { done: Boolean(s["about.mission"]), label: "Mission statement", href: "/asdfghjkl/settings" },
    { done: Boolean(s["contact.email"] && s["contact.phone"] && s["contact.address"]), label: "Contact email, phone and address", href: "/asdfghjkl/settings" },
    { done: Boolean(s["social.linkedin"] || s["social.instagram"] || s["social.x"] || s["social.youtube"]), label: "At least one social link", href: "/asdfghjkl/settings" },
    { done: leaders.length > 0 && leaders.every((l) => l.bio), label: "Approved leadership biographies", href: "/asdfghjkl/content/people" },
    { done: leaders.length > 0 && leaders.every((l) => l.imageId), label: "Approved leadership photographs", href: "/asdfghjkl/content/people" },
    { done: provisional === 0, label: "Programmes confirmed (none marked “proposed”)", href: "/asdfghjkl/content/programs" },
    { done: startups > 0, label: "First verified startup published", href: "/asdfghjkl/content/startups" },
    { done: mentors > 0, label: "First mentor profile published", href: "/asdfghjkl/content/people" },
  ];
  const remaining = checklist.filter((c) => !c.done).length;

  const stats = [
    { k: "Applications", v: appsTotal, sub: `${appsNew} awaiting review`, href: "/asdfghjkl/applications" },
    { k: "New enquiries", v: inqNew, sub: "Unread", href: "/asdfghjkl/inquiries" },
    { k: "Published startups", v: startups, sub: "In the archive", href: "/asdfghjkl/content/startups" },
    { k: "Upcoming events", v: upcoming, sub: "Published", href: "/asdfghjkl/content/events" },
  ];

  return (
    <>
      <AdminHeader title={`Good to see you, ${admin.name.split(" ")[0]}.`} kicker="Dashboard" />
      {sp.denied ? <Notice>That area requires an administrator role.</Notice> : null}

      <dl className="grid grid-cols-2 border-l border-t border-rule lg:grid-cols-4">
        {stats.map((x) => (
          <Link key={x.k} href={x.href} className="group border-b border-r border-rule p-5 hover:bg-pale">
            <dt className="label text-muted">{x.k}</dt>
            <dd className="mt-3 text-4xl font-semibold tabular-nums tracking-tight text-ink group-hover:text-blue">{x.v}</dd>
            <dd className="mt-1 text-xs text-muted">{x.sub}</dd>
          </Link>
        ))}
      </dl>

      <div className="mt-12 grid gap-12 xl:grid-cols-[1.1fr_1fr]">
        <section aria-labelledby="checklist">
          <div className="flex items-baseline justify-between border-b border-ink pb-2">
            <h2 id="checklist" className="font-semibold text-ink">
              Pre-launch content checklist
            </h2>
            <span className="label text-muted">{remaining ? `${remaining} outstanding` : "Complete"}</span>
          </div>
          <ul>
            {checklist.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-4 border-b border-rule py-2.5 text-sm">
                <span className="flex items-center gap-3">
                  <span aria-hidden className={`grid h-4 w-4 place-items-center border ${c.done ? "border-blue bg-blue text-[10px] text-white" : "border-muted"}`}>
                    {c.done ? "✓" : ""}
                  </span>
                  <span className={c.done ? "text-muted line-through" : "text-ink"}>{c.label}</span>
                  <span className="sr-only">{c.done ? "(done)" : "(outstanding)"}</span>
                </span>
                {!c.done ? (
                  <Link href={c.href} className="label u-link-static text-blue">
                    Resolve
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="activity">
          <h2 id="activity" className="border-b border-ink pb-2 font-semibold text-ink">
            Recent activity
          </h2>
          {activity.length ? (
            <ol>
              {activity.map((a) => (
                <li key={a.id} className="grid grid-cols-[7rem_1fr] gap-3 border-b border-rule py-2 text-sm">
                  <span className="label-sm pt-[3px] text-muted">{formatDate(a.createdAt, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  <span className="text-ink">
                    <strong className="font-medium">{a.user?.name ?? "System"}</strong> {a.action} {a.entity}
                    {a.summary ? <span className="text-muted"> — {a.summary}</span> : null}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="py-4 text-sm text-muted">No activity yet.</p>
          )}
        </section>
      </div>

      <div className="mt-12 grid gap-12 xl:grid-cols-2">
        <section aria-labelledby="recent-apps">
          <div className="flex items-baseline justify-between border-b border-ink pb-2">
            <h2 id="recent-apps" className="font-semibold text-ink">
              Latest applications
            </h2>
            <Link href="/asdfghjkl/applications" className="label u-link-static text-blue">
              All
            </Link>
          </div>
          {applications.length ? (
            <ul>
              {applications.map((a) => (
                <li key={a.id}>
                  <Link href={`/asdfghjkl/applications/${a.id}`} className="grid grid-cols-[1fr_auto] gap-3 border-b border-rule py-2.5 text-sm hover:bg-pale">
                    <span>
                      <span className="font-medium text-ink">{a.ventureName}</span> <span className="text-muted">— {a.founderName}</span>
                    </span>
                    <StatusTag value={a.status} label={APPLICATION_STATUS_LABEL[a.status]} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-sm text-muted">No applications have been received yet.</p>
          )}
        </section>
        <section aria-labelledby="recent-inq">
          <div className="flex items-baseline justify-between border-b border-ink pb-2">
            <h2 id="recent-inq" className="font-semibold text-ink">
              Latest enquiries
            </h2>
            <Link href="/asdfghjkl/inquiries" className="label u-link-static text-blue">
              All
            </Link>
          </div>
          {inquiries.length ? (
            <ul>
              {inquiries.map((q) => (
                <li key={q.id}>
                  <Link href={`/asdfghjkl/inquiries/${q.id}`} className="grid grid-cols-[1fr_auto] gap-3 border-b border-rule py-2.5 text-sm hover:bg-pale">
                    <span>
                      <span className="font-medium text-ink">{q.name}</span> <span className="text-muted">— {INQUIRY_TYPE_LABEL[q.type]}</span>
                    </span>
                    <StatusTag value={q.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-sm text-muted">No enquiries have been received yet.</p>
          )}
        </section>
      </div>
    </>
  );
}
