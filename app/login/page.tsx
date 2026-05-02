import Link from "next/link";

import { SiteShell } from "@/components/shared/SiteShell";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <SiteShell>
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col justify-center px-4 py-16">
        <h1 className="text-2xl font-bold text-slate-900">Patient login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage appointments and saved dentists. (Placeholder — connect your auth provider.)
        </p>
        <Button className="mt-8 rounded-full bg-teal-600 hover:bg-teal-700" asChild>
          <Link href="/patient/dashboard">Go to patient dashboard</Link>
        </Button>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link href="/register" className="font-medium text-teal-600 hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </SiteShell>
  );
}
