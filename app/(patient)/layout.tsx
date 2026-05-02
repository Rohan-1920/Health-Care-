import { SiteShell } from "@/components/shared/SiteShell";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
