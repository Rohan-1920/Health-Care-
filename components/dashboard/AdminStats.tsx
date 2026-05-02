import { Activity, UserCog } from "lucide-react";

export function AdminStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <Activity className="h-8 w-8 text-primary" aria-hidden />
        <h2 className="mt-3 font-semibold text-foreground">Platform health</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Bookings, cancellations, aur uptime metrics yahan render hon ge.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <UserCog className="h-8 w-8 text-primary" aria-hidden />
        <h2 className="mt-3 font-semibold text-foreground">User management</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Doctors verification aur roles admin panel se control hon ge.
        </p>
      </div>
    </div>
  );
}
