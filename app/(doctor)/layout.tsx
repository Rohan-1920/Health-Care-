import { SiteShell } from "@/components/shared/SiteShell";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
