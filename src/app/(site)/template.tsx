/** Re-mounts on every navigation, giving each page a soft entrance. */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
