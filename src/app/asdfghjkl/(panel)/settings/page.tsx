import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { SETTINGS, getSettings, type SettingKey } from "@/lib/settings";
import { AdminHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = { title: "Homepage & contact" };

export default async function SettingsPage() {
  await requireAdmin();
  const [values, stored] = await Promise.all([getSettings(), db.setting.findMany({ select: { key: true } })]);
  const storedKeys = new Set(stored.map((s) => s.key));
  const defs = (Object.entries(SETTINGS) as [SettingKey, (typeof SETTINGS)[SettingKey]][]).map(([key, d]) => ({
    key,
    label: d.label,
    group: d.group,
    multiline: "multiline" in d ? d.multiline : undefined,
    help: "help" in d ? d.help : undefined,
    fallback: d.fallback,
    value: values[key],
    stored: storedKeys.has(key),
  }));
  return (
    <>
      <AdminHeader title="Homepage & contact" kicker="Site">
        Key copy, institutional statements, contact details and social links. Empty institutional fields appear on the public site as clearly marked “awaiting approved content” notes.
      </AdminHeader>
      <SettingsForm defs={defs} />
    </>
  );
}
