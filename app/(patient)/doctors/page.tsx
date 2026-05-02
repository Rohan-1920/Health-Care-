import { redirect } from "next/navigation";

export default function DoctorsPageAlias() {
  redirect("/patient/doctors");
}
