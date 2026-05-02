import { redirect } from "next/navigation";

export default function LegacyPatientDoctorProfile({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/doctors/${params.id}`);
}
