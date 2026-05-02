import Image from "next/image";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export interface DoctorCardMiniProps {
  name: string;
  specialty: string;
  rating: number;
  image: string;
  className?: string;
}

export function DoctorCardMini({
  name,
  specialty,
  rating,
  image,
  className,
}: DoctorCardMiniProps) {
  return (
    <article
      className={cn(
        "w-full max-w-[260px] rounded-2xl border border-border/50 bg-white p-4 shadow-md shadow-black/[0.06]",
        className,
      )}
    >
      <div className="relative mx-auto mb-3 aspect-square w-[5.25rem] overflow-hidden rounded-xl bg-primary-light/50 ring-1 ring-primary/10">
        <Image
          src={image}
          alt={`${name}, ${specialty}`}
          fill
          className="object-cover"
          sizes="84px"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nODQnIGhlaWdodD0nODQnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0JyBmaWxsPScjZTVlN2ViJy8+PC9zdmc+"
        />
      </div>
      <h3 className="truncate text-center text-sm font-semibold text-secondary">{name}</h3>
      <p className="truncate text-center text-xs text-muted-foreground">{specialty}</p>
      <div className="mt-2 flex items-center justify-center gap-1">
        <Star className="h-3.5 w-3.5 fill-rating text-rating" aria-hidden />
        <span className="text-sm font-semibold tabular-nums text-secondary">{rating.toFixed(1)}</span>
      </div>
      <div className="mt-3 flex justify-center">
        <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
          Available
        </span>
      </div>
    </article>
  );
}
