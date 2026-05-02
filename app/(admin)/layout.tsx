import { SiteShell } from "@/components/shared/SiteShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
