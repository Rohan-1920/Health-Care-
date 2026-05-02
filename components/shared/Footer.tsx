import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

function ToothLogoWhite({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6.2 5.6c1.2-1.2 3.1-1.6 5-.8l.8.3.8-.3c1.9-.8 3.8-.4 5 .8 1.6 1.6 1.8 4.3.7 6.8-.9 2-1.8 3.9-2.6 5.8-.3.7-.9 1.1-1.6 1.1-.8 0-1.4-.5-1.6-1.3l-.7-3.1c-.1-.4-.6-.4-.7 0l-.7 3.1c-.2.8-.8 1.3-1.6 1.3-.7 0-1.3-.4-1.6-1.1-.8-1.9-1.7-3.8-2.6-5.8-1.1-2.5-.9-5.2.7-6.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

const social = [
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Twitter, label: "Twitter", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
] as const;

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <div className="flex items-center gap-2">
              <ToothLogoWhite className="h-8 w-8 shrink-0 text-white" />
              <span className="text-lg font-bold text-white">SehatBook</span>
            </div>
            <p className="mt-2 text-sm font-medium text-white">Find your perfect dentist.</p>
            <p className="mt-3 max-w-xs text-sm text-gray-400">
              SehatBook is a curated network of top-rated dentists. Find one perfect for you and book
              online instantly.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {social.map(({ Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-white transition-colors hover:bg-teal-600"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 font-semibold text-white">SehatBook</p>
            <ul className="space-y-3 text-sm">
              {[
                ["About Us", "/"],
                ["Careers", "/"],
                ["Learning Center", "/"],
                ["Patient Login", "/login"],
                ["Sitemap", "/"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-semibold text-white">For Dentists</p>
            <ul className="space-y-3 text-sm">
              {[
                ["Get Patients", "/for-dentists"],
                ["SehatBook vs Alternatives", "/for-dentists"],
                ["Case Studies", "/for-dentists"],
                ["Practice Login", "/doctor/dashboard"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-semibold text-white">Need Help?</p>
            <ul className="space-y-3 text-sm">
              {[
                ["Support", "/"],
                ["Accessibility", "/"],
                ["Privacy Policy", "/"],
                ["Terms of Service", "/"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-gray-500">2025 SehatBook Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
            <Link href="/doctors?city=Toronto" className="transition-colors hover:text-teal-400">
              Toronto
            </Link>
            <span aria-hidden>|</span>
            <Link href="/doctors?city=Vancouver" className="transition-colors hover:text-teal-400">
              Vancouver
            </Link>
            <span aria-hidden>|</span>
            <Link href="/doctors?city=Montreal" className="transition-colors hover:text-teal-400">
              Montreal
            </Link>
            <span aria-hidden>|</span>
            <Link href="/doctors?city=Calgary" className="transition-colors hover:text-teal-400">
              Calgary
            </Link>
            <span aria-hidden>|</span>
            <Link href="/doctors" className="transition-colors hover:text-teal-400">
              More...
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
