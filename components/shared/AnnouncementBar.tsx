"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const KEY = "sehatbook_announcement_dismissed";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    setDismissed(window.localStorage.getItem(KEY) === "1");
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(KEY, "1");
    setDismissed(true);
  };

  if (dismissed === null || dismissed) return null;

  return (
    <div className="w-full bg-teal-600 px-4 py-2 text-sm text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:flex-nowrap sm:justify-between">
        <p className="text-center sm:text-left">SehatBook — Find the best dentists across Canada</p>
        <div className="flex flex-shrink-0 items-center gap-4">
          <Link href="/register" className="whitespace-nowrap underline underline-offset-2">
            Get Started
          </Link>
          <button
            type="button"
            aria-label="Dismiss announcement"
            onClick={dismiss}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/15"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
