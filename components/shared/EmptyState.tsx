"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { MotionButton } from "@/components/shared/MotionButton";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
};

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  ctaText,
  ctaHref,
  onCtaClick,
}: EmptyStateProps) {
  const cta = ctaText ? (
    <MotionButton>
      {ctaHref ? (
        <Button asChild className="mt-6 bg-teal-600 hover:bg-teal-700">
          <Link href={ctaHref}>{ctaText}</Link>
        </Button>
      ) : (
        <Button type="button" className="mt-6 bg-teal-600 hover:bg-teal-700" onClick={onCtaClick}>
          {ctaText}
        </Button>
      )}
    </MotionButton>
  ) : null;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="h-16 w-16 text-gray-300" aria-hidden />
      <h3 className="mt-4 text-lg font-semibold text-gray-700">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      {cta}
    </div>
  );
}
