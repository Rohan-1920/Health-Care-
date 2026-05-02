import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DoctorProfileClient } from "@/components/doctor-profile/DoctorProfileClient";
import { mockDoctors } from "@/lib/constants";

function cleanDoctorName(name: string) {
  return name.replace(/^Dr\.\s*/i, "");
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const doctor = mockDoctors.find((d) => d.id === params.id);
  if (!doctor) {
    return { title: "Dentist | SehatBook" };
  }
  return {
    title: `Dr. ${cleanDoctorName(doctor.name)} – Dentist in ${doctor.city} | SehatBook`,
    description: `Book an appointment with Dr. ${cleanDoctorName(
      doctor.name,
    )}, experienced dentist at ${doctor.hospital} in ${doctor.city}. View reviews, services and available time slots.`,
    openGraph: {
      title: `Dr. ${cleanDoctorName(doctor.name)} – Dentist in ${doctor.city} | SehatBook`,
      description: `Book an appointment with Dr. ${cleanDoctorName(
        doctor.name,
      )}, experienced dentist at ${doctor.hospital} in ${doctor.city}. View reviews, services and available time slots.`,
    },
  };
}

export default function DoctorProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const doctor = mockDoctors.find((d) => d.id === params.id);
  if (!doctor) notFound();

  return <DoctorProfileClient doctor={doctor} />;
}
