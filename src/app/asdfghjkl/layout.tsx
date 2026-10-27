import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s — Administration — R Shivakumar Foundation" },
  robots: { index: false, follow: false },
};

export default function BreakpointRoot({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-white">{children}</div>;
}
