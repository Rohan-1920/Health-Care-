"use client";

import { motion } from "framer-motion";
import { Check, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

import { DoctorCard } from "@/components/shared/DoctorCard";
import { canadianCities, mockDoctors } from "@/lib/constants";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const cities = [...canadianCities.slice(0, 7), "Other"] as const;
const services = ["Routine Checkup", "Teeth Cleaning", "Braces", "Root Canal", "Teeth Whitening", "Implants", "Toothache or Pain", "Not Sure"];
const timing = ["As soon as possible", "This week", "This month", "Just browsing"];
const preferences = ["Female dentist", "Male dentist", "Evening availability", "Weekend slots", "Near my location", "Highly rated (4.5 stars and above)", "Budget friendly", "Experienced (10 or more years)"];

export function SmartMatchQuiz() {
  const [step, setStep] = useState<Step>(1);
  const [city, setCity] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTiming, setSelectedTiming] = useState("");
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [phone, setPhone] = useState("");

  const filtered = useMemo(() => {
    return mockDoctors
      .filter((doctor) => (city && city !== "Other" ? doctor.city === city : true))
      .filter((doctor) =>
        selectedServices.length
          ? selectedServices.some((service) => doctor.services.some((s) => s.toLowerCase().includes(service.toLowerCase().split(" ")[0] ?? "")))
          : true,
      )
      .slice(0, 8);
  }, [city, selectedServices]);

  const progress = Math.min(((step - 1) / 5) * 100, 100);
  const canNext =
    (step === 1 && Boolean(city)) ||
    (step === 2 && selectedServices.length > 0) ||
    (step === 3 && Boolean(selectedTiming)) ||
    step === 4 ||
    step === 5;

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-2xl">
        {step <= 5 ? (
          <>
            <p className="text-sm text-muted-foreground">Question {step} of 5</p>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </>
        ) : null}

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="mt-8">
          {step === 1 ? (
            <div>
              <h1 className="text-3xl font-bold">Which city are you in?</h1>
              <p className="mt-2 text-sm text-muted-foreground">Takes about 30 seconds</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {cities.map((item) => (
                  <button key={item} type="button" onClick={() => setCity(item)} className={`relative rounded-xl border p-4 text-left ${city === item ? "border-teal-600 bg-teal-50" : "border-border bg-white"}`}>
                    <MapPin className="mb-2 h-4 w-4 text-teal-600" />
                    {item}
                    {city === item ? <Check className="absolute right-3 top-3 h-4 w-4 text-teal-600" /> : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h1 className="text-3xl font-bold">What dental service do you need?</h1>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {services.map((item) => {
                  const selected = selectedServices.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setSelectedServices((prev) => (selected ? prev.filter((v) => v !== item) : [...prev, item]))
                      }
                      className={`relative rounded-xl border p-4 text-left ${selected ? "border-teal-600 bg-teal-50" : "border-border bg-white"}`}
                    >
                      <span className="text-xl">🦷</span>
                      <p className="mt-2">{item}</p>
                      {selected ? <Check className="absolute right-3 top-3 h-4 w-4 text-teal-600" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <h1 className="text-3xl font-bold">When do you want to visit?</h1>
              <div className="mt-6 grid gap-3">
                {timing.map((item) => (
                  <button key={item} type="button" onClick={() => setSelectedTiming(item)} className={`relative rounded-xl border p-4 text-left ${selectedTiming === item ? "border-teal-600 bg-teal-50" : "border-border bg-white"}`}>
                    {item}
                    {selectedTiming === item ? <Check className="absolute right-3 top-3 h-4 w-4 text-teal-600" /> : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div>
              <h1 className="text-3xl font-bold">Any preferences for your dentist?</h1>
              <div className="mt-6 flex flex-wrap gap-2">
                {preferences.map((item) => {
                  const selected = selectedPrefs.includes(item);
                  return (
                    <button key={item} type="button" onClick={() => setSelectedPrefs((prev) => (selected ? prev.filter((v) => v !== item) : [...prev, item]))} className={`rounded-full border px-4 py-2 text-sm ${selected ? "border-teal-600 bg-teal-50 text-teal-700" : "border-border bg-white"}`}>
                      {item}
                    </button>
                  );
                })}
              </div>
              <button type="button" className="mt-4 text-sm text-teal-700 underline" onClick={() => setStep(5)}>
                Skip this step
              </button>
            </div>
          ) : null}

          {step === 5 ? (
            <div>
              <h1 className="text-3xl font-bold">Get your matches sent to WhatsApp</h1>
              <div className="mt-6">
                <label htmlFor="quiz-phone" className="mb-2 block text-sm text-muted-foreground">
                  Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border px-3">🇨🇦 +1</span>
                  <input id="quiz-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 w-full rounded-r-lg border border-border px-3" placeholder="555-123-4567" />
                </div>
              </div>
              <button type="button" className="mt-4 rounded-full bg-teal-600 px-6 py-2.5 text-white" onClick={() => setStep(6)}>
                Get My Matches
              </button>
              <button type="button" className="mt-3 block text-sm text-teal-700 underline" onClick={() => setStep(6)}>
                Skip and see results
              </button>
            </div>
          ) : null}

          {step === 6 ? (
            <div>
              <h1 className="text-3xl font-bold">We found {filtered.length} dentists that match your preferences!</h1>
              <p className="mt-2 text-muted-foreground">
                {city || "Canada"} · {selectedServices[0] ?? "General Dentistry"}
              </p>
              <div className="mt-6 grid gap-4">
                {filtered.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
              <div className="mt-6 flex gap-4 text-sm">
                <button type="button" className="underline" onClick={() => {
                  setStep(1);
                  setCity("");
                  setSelectedServices([]);
                  setSelectedTiming("");
                  setSelectedPrefs([]);
                  setPhone("");
                }}>
                  Start Over
                </button>
                <button type="button" className="underline" onClick={() => setStep(4)}>
                  Edit Preferences
                </button>
              </div>
            </div>
          ) : null}
        </motion.div>

        {step <= 5 ? (
          <div className="mt-8 flex items-center justify-between">
            <button type="button" className="text-sm text-muted-foreground underline" onClick={() => setStep((prev) => Math.max(1, prev - 1) as Step)}>
              Back
            </button>
            {canNext ? (
              <button type="button" className="rounded-full bg-teal-600 px-6 py-2.5 text-white" onClick={() => setStep((prev) => Math.min(6, prev + 1) as Step)}>
                Next
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
