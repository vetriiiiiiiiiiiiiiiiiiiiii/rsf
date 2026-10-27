import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { setUserActive } from "@/app/actions/admin";
import { AdminHeader, StatusTag } from "@/components/admin/ui";
import { NewUserForm, PasswordForm } from "@/components/admin/account-forms";
import { ConfirmButton } from "@/components/admin/confirm-button";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const admin = await requireAdmin();
  const users = admin.role === "ADMIN" ? await db.adminUser.findMany({ orderBy: { createdAt: "asc" } }) : [];

  return (
    <>
      <AdminHeader title="Account" kicker="Site">
        Signed in as {admin.email}.
      </AdminHeader>
      <section aria-labelledby="pw" className="mb-16">
        <h2 id="pw" className="mb-6 font-semibold text-ink">
          Change password
        </h2>
        <PasswordForm />
      </section>
      {admin.role === "ADMIN" ? (
        <div className="grid gap-16 xl:grid-cols-2">
          <section aria-labelledby="users">
            <h2 id="users" className="border-b border-ink pb-2 font-semibold text-ink">
              Users
            </h2>
            <ul>
              {users.map((u) => (
                <li key={u.id} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-rule py-3 text-sm">
                  <span>
                    <span className="font-medium text-ink">{u.name}</span> <span className="text-muted">· {u.email}</span>
                    <span className="mt-1 flex gap-2">
                      <StatusTag value={u.role} />
                      {!u.active ? <StatusTag value="ARCHIVED" label="Deactivated" /> : null}
                      <span className="label-sm text-muted">{u.lastLoginAt ? `Last sign-in ${formatDate(u.lastLoginAt, { day: "2-digit", month: "short", year: "numeric" })}` : "Never signed in"}</span>
                    </span>
                  </span>
                  {u.id !== admin.id ? (
                    <form action={setUserActive.bind(null, u.id, !u.active)}>
                      <ConfirmButton message={u.active ? `Deactivate ${u.email}? They will be signed out.` : `Reactivate ${u.email}?`}>{u.active ? "Deactivate" : "Reactivate"}</ConfirmButton>
                    </form>
                  ) : (
                    <span className="label-sm text-muted">You</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="new-user">
            <h2 id="new-user" className="mb-6 border-b border-ink pb-2 font-semibold text-ink">
              Add a user
            </h2>
            <NewUserForm />
          </section>
        </div>
      ) : null}
    </>
  );
}
