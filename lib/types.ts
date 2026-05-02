export type DoctorGender = "male" | "female";

export interface Doctor {
  id: string;
  name: string;
  specialty: "Dentist";
  services: string[];
  hospital: string;
  city: string;
  rating: number;
  reviewCount: number;
  feeMin: number;
  feeMax: number;
  image: string;
  availableToday: boolean;
  experience: number;
  languages: string[];
  gender: DoctorGender;
}

export interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  dateOfBirth?: string;
  createdAt: string;
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  doctorId: string;
  patientId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  available: boolean;
}

/** Hero SearchBar + legacy helpers */
export interface SearchFilters {
  query: string;
  city: string;
  service: string;
}

export type GenderFilter = "male" | "female" | "any";

export type DoctorSortOption =
  | "rating"
  | "fee_asc"
  | "fee_desc"
  | "availability";

export interface DoctorSearchState {
  query: string;
  selectedCities: string[];
  selectedServices: string[];
  feeSliderMin: number;
  feeSliderMax: number;
  /** null = Any */
  minRating: number | null;
  gender: GenderFilter;
  availableTodayOnly: boolean;
  sortBy: DoctorSortOption;
}
