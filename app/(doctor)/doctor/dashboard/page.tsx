import { DoctorScheduleSummary } from "@/components/dashboard/DoctorScheduleSummary";

export default function DoctorDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-urdu text-3xl font-semibold text-secondary">Doctor dashboard</h1>
      <p className="mt-2 text-muted-foreground">Apni availability aur appointments manage karein.</p>
      <div className="mt-8">
        <DoctorScheduleSummary />
      </div>
    </div>
  );
}
