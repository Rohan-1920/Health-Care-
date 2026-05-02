"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/doctors", label: "Find a Dentist", hash: null },
  { href: "/#how-it-works", label: "How It Works", hash: "#how-it-works" },
  { href: "/for-dentists", label: "For Dentists", hash: null },
  { href: "/#testimonials", label: "Reviews", hash: "#testimonials" },
] as const;

function ToothLogo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-8 w-8 shrink-0 text-teal-600", className)}
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

function isNavLinkActive(
  link: (typeof NAV_LINKS)[number],
  pathname: string,
  hash: string,
) {
  if (link.hash) {
    return pathname === "/" && hash === link.hash;
  }
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hash, setHash] = useState("");
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 8);
  });

  const syncHash = useCallback(() => {
    if (typeof window === "undefined") return;
    setHash(window.location.hash);
  }, []);

  useEffect(() => {
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname, syncHash]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -8, opacity: 0.98 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "sticky top-0 z-50 w-full border-b border-gray-100 bg-white transition-shadow duration-200",
          scrolled && "shadow-sm",
        )}
      >
        <div className="relative mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
          <Link
            href="/"
            className="relative z-10 flex shrink-0 items-start gap-2.5"
            onClick={() => setMobileOpen(false)}
          >
            <ToothLogo />
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-slate-900">SehatBook</span>
              <span className="text-xs text-gray-400">Dental Care, Simplified</span>
            </span>
          </Link>

          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => {
              const active = isNavLinkActive(link, pathname, hash);
              const showUnderline =
                hoveredHref === link.href || (hoveredHref === null && active);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-2 text-sm font-medium transition-colors",
                    active ? "text-teal-600" : "text-gray-600 hover:text-teal-600",
                  )}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  onMouseLeave={() => setHoveredHref(null)}
                >
                  <span className="relative z-10">{link.label}</span>
                  {showUnderline ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-0.5 rounded-full bg-teal-600"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-teal-600" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button
              size="sm"
              className="rounded-full bg-teal-600 px-5 text-sm text-white hover:bg-teal-700"
              asChild
            >
              <Link href="/register">Sign Up Free</Link>
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              key="mobile-nav-backdrop"
              role="presentation"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[55] bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="mobile-nav-drawer"
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{
                type: "tween",
                duration: 0.35,
                ease: [0.32, 0.72, 0, 1],
              }}
              className="fixed inset-0 z-[60] flex flex-col bg-white md:hidden"
            >
              <div className="flex h-16 shrink-0 items-center justify-end border-b border-gray-100 px-4">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col px-4 py-2" aria-label="Mobile primary">
                {NAV_LINKS.map((link) => {
                  const active = isNavLinkActive(link, pathname, hash);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "border-b border-gray-100 py-4 text-lg font-medium",
                        active ? "text-teal-600" : "text-gray-800",
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex shrink-0 flex-col gap-3 border-t border-gray-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Button variant="ghost" className="h-11 w-full text-gray-700" asChild>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Log In
                  </Link>
                </Button>
                <Button
                  className="h-11 w-full rounded-full bg-teal-600 text-sm text-white hover:bg-teal-700"
                  asChild
                >
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    Sign Up Free
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
