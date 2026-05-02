"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  Clock3,
  Heart,
  LayoutDashboard,
  LogOut,
  SendHorizontal,
  Sparkles,
  Star,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/EmptyState";
import { MotionButton } from "@/components/shared/MotionButton";
import { Button } from "@/components/ui/button";

type AppointmentStatus = "Confirmed" | "Pending" | "Cancelled";

type Appointment = {
  id: number;
  day: string;
  date: string;
  month: string;
  dentist: string;
  concern: string;
  clinic: string;
  time: string;
  status: AppointmentStatus;
};

type SavedDentist = {
  id: number;
  name: string;
  clinic: string;
  rating: number;
  initials: string;
};

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
  time: string;
};

const patientName = "Alex Morgan";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
  { label: "My Appointments", href: "/dashboard/appointments", icon: Calendar, active: false },
  { label: "Saved Dentists", href: "/dashboard/saved", icon: Heart, active: false },
  { label: "Profile Settings", href: "/dashboard/profile", icon: User, active: false },
];

const notificationItems = [
  {
    id: 1,
    text: "Appointment confirmed with Dr. James Carter - Tomorrow 10am",
    time: "2m ago",
    color: "bg-emerald-500",
  },
  { id: 2, text: "Reminder: Teeth cleaning in 2 days", time: "1h ago", color: "bg-amber-500" },
  { id: 3, text: "How was your visit? Rate Dr. Sarah Mitchell", time: "3h ago", color: "bg-sky-500" },
];

const initialAppointments: Appointment[] = [
  {
    id: 1,
    day: "Mon",
    date: "15",
    month: "Mar",
    dentist: "Dr. James Carter",
    concern: "Teeth Cleaning",
    clinic: "Bright Smile Dental",
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    day: "Wed",
    date: "20",
    month: "Mar",
    dentist: "Dr. Sarah Mitchell",
    concern: "Braces Consultation",
    clinic: "City Dental Care",
    time: "03:30 PM",
    status: "Pending",
  },
  {
    id: 3,
    day: "Fri",
    date: "22",
    month: "Mar",
    dentist: "Dr. Michael Brown",
    concern: "Root Canal Follow-up",
    clinic: "Premier Dental Studio",
    time: "12:15 PM",
    status: "Cancelled",
  },
];

const initialSavedDentists: SavedDentist[] = [
  { id: 11, name: "Dr. Sarah Mitchell", clinic: "City Dental Care", rating: 4.8, initials: "SM" },
  { id: 12, name: "Dr. Michael Brown", clinic: "Premier Dental Studio", rating: 4.7, initials: "MB" },
  { id: 13, name: "Dr. Emily Davis", clinic: "Family Dental Group", rating: 4.9, initials: "ED" },
];

const smartReply = (text: string) => {
  const value = text.toLowerCase();
  if (value.includes("find") || value.includes("dentist")) {
    return "I can help you find a dentist! Are you looking for a specific service like braces or root canal? Check our listings at /doctors";
  }
  if (value.includes("toothache") || value.includes("pain")) {
    return "Toothaches need prompt attention! I recommend booking an emergency consultation. Want me to find available dentists near you?";
  }
  if (value.includes("appointment") || value.includes("book")) {
    return "You have 1 upcoming appointment with Dr. James Carter on March 15 at 10am. Need to reschedule?";
  }
  if (value.includes("cost") || value.includes("fee") || value.includes("price")) {
    return "Consultation fees range from $80 to $300 depending on the dentist and service. Check individual profiles for exact pricing.";
  }
  if (value.includes("whiten") || value.includes("whitening")) {
    return "Teeth whitening is a popular cosmetic procedure! We have several dentists offering whitening services. Want me to show you available options?";
  }
  if (value.includes("braces")) {
    return "We have orthodontists offering both traditional braces and Invisalign. Shall I filter dentists by braces service for you?";
  }
  return "That's a great question! For detailed advice, I recommend consulting directly with one of our verified dentists. Can I help you book an appointment?";
};

const statusClass: Record<AppointmentStatus, string> = {
  Confirmed: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-rose-100 text-rose-700",
};

export default function PatientDashboardPage() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [savedDentists, setSavedDentists] = useState(initialSavedDentists);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const metrics = useMemo(
    () => [
      { label: "Upcoming", value: appointments.filter((a) => a.status !== "Cancelled").length, icon: Calendar, iconWrap: "bg-teal-100", iconColor: "text-teal-700" },
      { label: "Completed", value: 18, icon: CheckCircle2, iconWrap: "bg-emerald-100", iconColor: "text-emerald-700" },
      { label: "Saved Dentists", value: savedDentists.length, icon: Heart, iconWrap: "bg-pink-100", iconColor: "text-pink-700" },
      { label: "Reviews Given", value: 7, icon: Star, iconWrap: "bg-amber-100", iconColor: "text-amber-700" },
    ],
    [appointments, savedDentists.length],
  );

  const openAssistant = () => {
    setAssistantOpen(true);
    if (messages.length > 0) return;
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        text: "Hi! I can help you find the right dentist, book appointments, or answer dental health questions. How can I help you today?",
        time: "Now",
      },
    ]);
  };

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    const userMessage: ChatMessage = { id: Date.now(), role: "user", text: trimmed, time: "Now" };
    const reply: ChatMessage = {
      id: Date.now() + 1,
      role: "assistant",
      text: smartReply(trimmed),
      time: "Now",
    };
    setMessages((prev) => [...prev, userMessage, reply]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen border-r border-slate-200 bg-white md:flex md:w-16 md:flex-col md:items-center md:py-6 lg:w-60 lg:items-stretch lg:px-4">
          <div className="mb-8 w-full px-1 lg:px-0">
            <div className="flex items-center gap-3 lg:flex-col lg:items-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-lg font-semibold text-white">
                AR
              </div>
              <div className="hidden lg:block">
                <p className="font-semibold">{patientName}</p>
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Patient</span>
              </div>
            </div>
          </div>

          <nav className="flex w-full flex-1 flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  title={item.label}
                  className={`group flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${
                    item.active ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                  } md:justify-center lg:justify-start`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="hidden lg:inline lg:pl-3">{item.label}</span>
                  <span className="pointer-events-none absolute left-16 z-20 hidden rounded-md bg-slate-900 px-2 py-1 text-xs text-white group-hover:md:block lg:hidden">
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <div className="mt-auto">
              <button
                type="button"
                title="Logout"
                className="group relative flex w-full items-center rounded-lg px-3 py-2 text-rose-600 transition-all duration-200 hover:bg-rose-50 md:justify-center lg:justify-start"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden lg:inline lg:pl-3">Logout</span>
                <span className="pointer-events-none absolute left-16 z-20 hidden rounded-md bg-slate-900 px-2 py-1 text-xs text-white group-hover:md:block lg:hidden">
                  Logout
                </span>
              </button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-8">
          <header className="relative mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Good morning, {patientName}!</h1>
            <div className="relative">
              <button
                type="button"
                aria-label="Open notifications"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="relative rounded-full p-2 transition hover:bg-slate-100"
              >
                <Bell className="h-5 w-5 text-slate-700" />
                <span className="absolute -right-0.5 -top-0.5 rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white">
                  3
                </span>
              </button>

              <AnimatePresence>
                {notificationsOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
                  >
                    <div className="space-y-3">
                      {notificationItems.map((note) => (
                        <div key={note.id} className="flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                          <span className={`mt-1 h-2.5 w-2.5 rounded-full ${note.color}`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm">{note.text}</p>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-xs text-slate-500">{note.time}</span>
                              <span className="h-2 w-2 rounded-full bg-teal-500" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="mt-3 text-sm font-medium text-teal-700 hover:text-teal-800">
                      Mark all read
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </header>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.35 }}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="mb-4 flex justify-end">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${item.iconWrap}`}>
                      <Icon className={`h-5 w-5 ${item.iconColor}`} />
                    </span>
                  </div>
                  <p className="text-3xl font-bold">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                </motion.article>
              );
            })}
          </section>

          <section className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
              <Link href="/dashboard/appointments" className="text-sm font-medium text-teal-700 hover:text-teal-800">
                View All
              </Link>
            </div>

            {appointments.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white px-4">
                <EmptyState
                  icon={Calendar}
                  title="No upcoming appointments"
                  subtitle="Time for your next dental checkup!"
                  ctaText="Find a Dentist"
                  ctaHref="/doctors"
                />
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
                className="space-y-3"
              >
                {appointments.map((appointment) => (
                  <motion.article
                    key={appointment.id}
                    variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                    className="rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <div className="w-16 rounded-xl bg-teal-50 p-2 text-center">
                        <p className="text-xs text-slate-500">{appointment.day}</p>
                        <p className="text-2xl font-bold">{appointment.date}</p>
                        <p className="text-xs text-slate-500">{appointment.month}</p>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                            {appointment.dentist
                              .replace("Dr. ", "")
                              .split(" ")
                              .slice(0, 2)
                              .map((v) => v[0])
                              .join("")}
                          </div>
                          <p className="font-semibold">{appointment.dentist}</p>
                        </div>
                        <p className="text-sm text-slate-500">{appointment.concern}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {appointment.clinic}
                          </span>
                          <span className="inline-flex items-center gap-1 text-teal-700">
                            <Clock3 className="h-4 w-4" />
                            {appointment.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 md:flex-col md:items-end">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[appointment.status]}`}>
                          {appointment.status}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            onClick={() => setCancelingId(appointment.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </section>

          <section className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Saved Dentists</h2>
              <Link href="/dashboard/saved" className="text-sm font-medium text-teal-700 hover:text-teal-800">
                View All
              </Link>
            </div>

            {savedDentists.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white px-4">
                <EmptyState
                  icon={Heart}
                  title="No saved dentists yet"
                  subtitle="Tap the heart on any dentist profile to save them"
                />
              </div>
            ) : (
              <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
                {savedDentists.map((dentist) => (
                  <article key={dentist.id} className="relative min-w-[200px] rounded-xl border border-slate-200 bg-white p-4">
                    <button
                      type="button"
                      aria-label={`Remove ${dentist.name} from saved`}
                      className="absolute right-3 top-3 text-rose-500"
                      onClick={() => {
                        setSavedDentists((prev) => prev.filter((d) => d.id !== dentist.id));
                        toast.info("Removed from saved dentists");
                      }}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                      {dentist.initials}
                    </div>
                    <p className="font-semibold">{dentist.name}</p>
                    <p className="text-sm text-slate-500">{dentist.clinic}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm text-amber-600">
                      <Star className="h-4 w-4 fill-current" />
                      {dentist.rating}
                    </p>
                    <MotionButton>
                      <Button asChild className="mt-3 w-full bg-teal-600 text-white hover:bg-teal-700">
                        <Link href={`/book/${dentist.id}`}>Book Again</Link>
                      </Button>
                    </MotionButton>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">Your Dental Health Tips</h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  title: "Brush Twice Daily",
                  text: "Brush for 2 minutes, morning and night, for healthy teeth and gums.",
                  bg: "bg-teal-100",
                  icon: (
                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-teal-700" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h10v3H3zM5 9v10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9" />
                      <path d="M13 7h7m-7 3h6" />
                    </svg>
                  ),
                },
                {
                  title: "Floss Every Day",
                  text: "Flossing removes plaque between teeth that your brush can't reach.",
                  bg: "bg-amber-100",
                  icon: (
                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-amber-700" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="8" cy="8" r="3" />
                      <circle cx="16" cy="16" r="3" />
                      <path d="M10.2 10.2l3.6 3.6" />
                    </svg>
                  ),
                },
                {
                  title: "Visit Every 6 Months",
                  text: "Regular checkups catch problems early and keep your smile healthy.",
                  bg: "bg-emerald-100",
                  icon: <Calendar className="h-6 w-6 text-emerald-700" />,
                },
              ].map((tip, index) => (
                <motion.article
                  key={tip.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <span className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full ${tip.bg}`}>{tip.icon}</span>
                  <p className="font-semibold">{tip.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{tip.text}</p>
                </motion.article>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">Recent Activity</h2>
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
              {[
                { text: "Appointment with Dr. James Carter confirmed", time: "5m ago", color: "bg-emerald-500" },
                { text: "You saved Dr. Sarah Mitchell", time: "2h ago", color: "bg-pink-500" },
                { text: "Review submitted for Dr. Michael Brown", time: "Yesterday", color: "bg-amber-500" },
                { text: "Appointment cancelled", time: "2 days ago", color: "bg-rose-500" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <div>
                    <p className="text-sm">{item.text}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-slate-200 bg-white md:hidden">
        <div className="grid h-full grid-cols-4">
          {[
            { label: "Home", icon: LayoutDashboard, href: "/dashboard", active: true },
            { label: "Appointments", icon: Calendar, href: "/dashboard/appointments", active: false },
            { label: "Saved", icon: Heart, href: "/dashboard/saved", active: false },
            { label: "Profile", icon: User, href: "/dashboard/profile", active: false },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`flex flex-col items-center justify-center gap-1 text-xs ${
                  tab.active ? "text-teal-700" : "text-slate-500"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <button
        type="button"
        aria-label="Open AI dental assistant"
        className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg md:bottom-6"
        onClick={openAssistant}
      >
        <span className="pulse-ring" />
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <Sparkles className="relative z-10 h-6 w-6" />
        </motion.span>
      </button>

      <AnimatePresence>
        {assistantOpen ? (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-[360px] flex-col border-l border-slate-200 bg-white shadow-xl sm:w-[360px]"
          >
            <div className="flex items-center justify-between bg-teal-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <p className="font-semibold">AI Dental Assistant</p>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-teal-700">Beta</span>
              </div>
              <button type="button" aria-label="Close assistant panel" onClick={() => setAssistantOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((item) => (
                <div key={item.id} className={item.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      item.role === "user" ? "rounded-tr-none bg-teal-600 text-white" : "rounded-tl-none bg-slate-100 text-slate-800"
                    }`}
                  >
                    {item.text}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.time}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 p-3">
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") sendMessage();
                  }}
                  placeholder="Type a message..."
                  className="h-10 flex-1 rounded-md border border-slate-300 px-3 text-sm outline-none ring-teal-600 focus:ring-2"
                />
                <Button className="bg-teal-600 px-3 hover:bg-teal-700" onClick={sendMessage}>
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {cancelingId !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4"
          >
            <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
              <h3 className="text-lg font-semibold">Cancel Appointment</h3>
              <p className="mt-2 text-sm text-slate-600">Are you sure you want to cancel this appointment?</p>
              <div className="mt-5 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCancelingId(null)}>
                  Cancel
                </Button>
                <Button
                  className="bg-rose-600 hover:bg-rose-700"
                  onClick={() => {
                    setAppointments((prev) => prev.filter((item) => item.id !== cancelingId));
                    setCancelingId(null);
                    toast.info("Appointment cancelled successfully");
                  }}
                >
                  Yes, Cancel Appointment
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .pulse-ring {
          position: absolute;
          width: 56px;
          height: 56px;
          border-radius: 9999px;
          border: 2px solid rgba(13, 148, 136, 0.45);
          animation: pulse-ring 1.8s infinite;
        }
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.65);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
