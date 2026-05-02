# SehatBook · Healthcare Booking

A **Canada-focused dental marketplace** frontend built with **Next.js (App Router)** — browse dentists, filter by city and services, book appointments, and explore a polished marketing homepage with quiz matching.

---

## Features

| Area | What’s included |
|------|-----------------|
| **Marketing** | Hero with search, “How it works” (tabs + stats + trust), featured dentists, popular cities, testimonials, CTA blocks |
| **Discovery** | Doctor listing with filters (city, services, fees, rating), search query + sorting |
| **Booking** | Multi-step booking flow with calendar / time slots (demo UX) |
| **Quiz** | Short smart-match questionnaire (`/quiz`) |
| **Profiles** | Dentist detail pages with booking widget |
| **Shells** | Separate layouts for patient, doctor, and admin areas |

> **Note:** Doctor data is **mocked** in `lib/constants.ts` for demos — swap for a real API when you wire the backend.

---

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router) · React 18 · TypeScript  
- **Styling:** Tailwind CSS · `tailwindcss-animate` · CSS variables (`app/globals.css`)  
- **UI:** Radix primitives (`@radix-ui/*`), `class-variance-authority`, `tailwind-merge`  
- **Motion:** Framer Motion  
- **Forms:** React Hook Form · Zod (`@hookform/resolvers`)  
- **Icons:** Lucide React  
- **Feedback:** Sonner toasts  

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)  
- **npm** (ships with Node)

---

## Getting Started

```bash
# Clone
git clone https://github.com/Rohan-1920/Health-Care-.git
cd Health-Care-

# Install
npm install

# Dev server — http://localhost:3000
npm run dev
```

### Other scripts

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build |
| `npm run start` | Run production server (after `build`) |
| `npm run lint` | ESLint (Next.js config) |

---

## Project Structure (high level)

```
app/                    # Routes — marketing, patient, doctor, admin
components/
  home/                 # Hero, HowItWorks, FeaturedDoctors, etc.
  shared/               # Navbar, Footer, SearchBar, DoctorCard, …
  booking/              # Booking steps, calendar, slots
  doctor-profile/       # Profile + booking widget
hooks/                  # useSearch, useBooking
lib/                    # Types, constants (mock doctors), utils
public/images/          # Static assets
```

---

## Key Routes (examples)

| Path | Role |
|------|------|
| `/` | Homepage |
| `/doctors` | Redirects to patient doctors listing |
| `/patient/doctors` | Dentist directory |
| `/patient/doctors/[id]` | Dentist profile |
| `/book/[doctorId]` | Booking flow entry |
| `/quiz` | Match quiz |
| `/login`, `/register` | Auth placeholders |
| `/for-dentists` | Dentist-facing landing |

---

## Brand & Theming

- Primary palette is **teal / cyan** aligned with healthcare trust cues.  
- Theme tokens live under `:root` in `app/globals.css` (HSL CSS variables consumed by Tailwind).

---

## Contributing

1. Fork the repo · create a branch · open a PR with a clear description.  
2. Run `npm run lint` before submitting.

---

## License

This project is **private / educational** unless you add an explicit `LICENSE` file. Adjust this section when you publish under MIT, Apache-2.0, etc.

---

## Maintainer

Repository: **[Rohan-1920/Health-Care-](https://github.com/Rohan-1920/Health-Care-)**

Questions or improvements — open an issue or PR on GitHub.
