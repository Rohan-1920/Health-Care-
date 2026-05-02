import { CalendarDays, ClipboardList } from "lucide-react";

export function PatientOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <CalendarDays className="h-8 w-8 text-primary" aria-hidden />
        <h2 className="mt-3 font-semibold text-foreground">Agla appointment</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Jab booking complete ho gi yahan summary dikhe gi.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <ClipboardList className="h-8 w-8 text-primary" aria-hidden />
        <h2 className="mt-3 font-semibold text-foreground">Records</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Past visits aur prescriptions yahan integrate hon ge.
        </p>
      </div>
    </div>
  );
}
