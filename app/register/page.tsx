import Link from "next/link";

import { SiteShell } from "@/components/shared/SiteShell";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <SiteShell>
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col justify-center px-4 py-16">
        <h1 className="text-2xl font-bold text-slate-900">Create your free account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join SehatBook to book dentists in a few taps. (Placeholder — connect your auth provider.)
        </p>
        <Button className="mt-8 rounded-full bg-teal-600 hover:bg-teal-700" asChild>
          <Link href="/patient/dashboard">Continue to dashboard</Link>
        </Button>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-teal-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </SiteShell>
  );
}
