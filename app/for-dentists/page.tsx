import Link from "next/link";

import { SiteShell } from "@/components/shared/SiteShell";
import { Button } from "@/components/ui/button";

export default function ForDentistsPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Grow your practice with SehatBook</h1>
        <p className="mt-4 text-muted-foreground">
          List your clinic, get discovered by patients searching in your city, and accept online bookings.
          This page is a placeholder — your marketing team can expand it anytime.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button className="rounded-full bg-teal-600 px-6 hover:bg-teal-700" asChild>
            <Link href="/doctor/dashboard">Practice dashboard</Link>
          </Button>
          <Button variant="outline" className="rounded-full px-6" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
