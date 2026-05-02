import { AdminStats } from "@/components/dashboard/AdminStats";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-urdu text-3xl font-semibold text-secondary">Admin</h1>
      <p className="mt-2 text-muted-foreground">Platform-wide controls aur analytics.</p>
      <div className="mt-8">
        <AdminStats />
      </div>
    </div>
  );
}
