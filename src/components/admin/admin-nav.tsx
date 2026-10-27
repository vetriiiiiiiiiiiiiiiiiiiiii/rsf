"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Item = { href: string; label: string; badge?: number };
type Group = { title: string; items: Item[] };

export function AdminNav({ groups }: { groups: Group[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/asdfghjkl" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      <button type="button" className="label border border-ink px-3 py-2 lg:hidden" aria-expanded={open} aria-controls="admin-nav" onClick={() => setOpen((o) => !o)}>
        {open ? "Close menu" : "Menu"}
      </button>
      <nav id="admin-nav" aria-label="Administration" className={`${open ? "block" : "hidden"} lg:block`}>
        {groups.map((g) => (
          <div key={g.title} className="mt-6">
            <p className="label-sm text-muted">{g.title}</p>
            <ul className="mt-2">
              {g.items.map((i) => (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    onClick={() => setOpen(false)}
                    aria-current={active(i.href) ? "page" : undefined}
                    className="flex items-center justify-between border-l-2 border-transparent py-1.5 pl-3 text-[0.92rem] text-ink hover:text-blue aria-[current=page]:border-blue aria-[current=page]:font-semibold aria-[current=page]:text-blue"
                  >
                    {i.label}
                    {i.badge ? <span className="label-sm bg-blue px-1.5 py-0.5 text-white">{i.badge}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}
