import Link from "next/link";

import { PatientOverview } from "@/components/dashboard/PatientOverview";
import { Button } from "@/components/ui/button";

export default function PatientDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-urdu text-3xl font-semibold text-secondary">Patient dashboard</h1>
        <Button asChild>
          <Link href="/patient/book">Nayi booking</Link>
        </Button>
      </div>
      <div className="mt-8">
        <PatientOverview />
      </div>
    </div>
  );
}
