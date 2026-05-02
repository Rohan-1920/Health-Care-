import Link from "next/link";

import { ForDentists } from "@/components/home/ForDentists";
import { FeaturedDoctors } from "@/components/home/FeaturedDoctors";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PopularCities } from "@/components/home/PopularCities";
import { Testimonials } from "@/components/home/Testimonials";
import { SiteShell } from "@/components/shared/SiteShell";
import { mockDoctors } from "@/lib/constants";

export default function HomePage() {
  return (
    <SiteShell>
      <HeroSection />
      <HowItWorks />
      <PopularCities />
      <FeaturedDoctors doctors={mockDoctors.slice(0, 6)} />
      <section className="py-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-teal-100 bg-teal-50 px-6 py-8 text-center">
          <p className="text-lg font-semibold text-secondary">Not sure which dentist is right for you?</p>
          <Link href="/quiz" className="mt-4 inline-flex rounded-full bg-teal-600 px-6 py-2.5 text-white hover:bg-teal-700">
            Take our 30-second quiz
          </Link>
        </div>
      </section>
      <Testimonials />
      <ForDentists />
    </SiteShell>
  );
}
