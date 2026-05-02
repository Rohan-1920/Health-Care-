import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DoctorBookingFlow } from "@/components/booking-flow/DoctorBookingFlow";
import { mockDoctors } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: { doctorId: string };
}): Promise<Metadata> {
  const doctor = mockDoctors.find((d) => d.id === params.doctorId);
  if (!doctor) return { title: "Book Appointment | SehatBook" };

  return {
    title: `Book ${doctor.name} | SehatBook`,
  };
}

export default function BookDoctorPage({
  params,
}: {
  params: { doctorId: string };
}) {
  const doctor = mockDoctors.find((d) => d.id === params.doctorId);
  if (!doctor) notFound();

  return <DoctorBookingFlow doctor={doctor} />;
}
