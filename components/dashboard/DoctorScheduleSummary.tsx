import { Clock, Users } from "lucide-react";

export function DoctorScheduleSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <Clock className="h-8 w-8 text-primary" aria-hidden />
        <h2 className="mt-3 font-semibold text-foreground">Aaj ki diary</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Slots aur cancellations ka overview yahan hoga.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <Users className="h-8 w-8 text-primary" aria-hidden />
        <h2 className="mt-3 font-semibold text-foreground">Patients queue</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Checked-in patients list baad mein sync ho gi.
        </p>
      </div>
    </div>
  );
}
