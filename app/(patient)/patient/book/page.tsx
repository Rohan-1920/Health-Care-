import { Suspense } from "react";

import { BookAppointmentClient } from "@/components/booking/BookAppointmentClient";

export default function BookPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-muted-foreground">Loading…</div>}>
      <BookAppointmentClient />
    </Suspense>
  );
}
