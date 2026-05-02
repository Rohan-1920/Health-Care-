import type { Metadata } from "next";
import { Noto_Nastaliq_Urdu, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";

import { PageTransition } from "@/components/shared/PageTransition";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-urdu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SehatBook - Find & Book Dentists in Canada",
  description:
    "Book appointments with verified dentists in Toronto, Vancouver, Montreal and cities across Canada. Instant booking, no waiting.",
  keywords: [
    "dentist near me Canada",
    "book dentist online",
    "dental appointment Canada",
    "find dentist Toronto Vancouver",
    "SehatBook",
  ],
  openGraph: {
    title: "SehatBook - Find & Book Dentists in Canada",
    description:
      "Book appointments with verified dentists in Toronto, Vancouver, Montreal and cities across Canada. Instant booking, no waiting.",
    type: "website",
    locale: "en_CA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} ${notoNastaliqUrdu.variable}`}>
        <PageTransition>{children}</PageTransition>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
