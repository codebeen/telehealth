export interface TimeSlot {
  id: string;
  start: string; // e.g. "09:00 AM"
  end: string;   // e.g. "09:30 AM"
  isBooked: boolean;
}

export interface DaySchedule {
  date: string; // e.g. "2026-05-29"
  slots: TimeSlot[];
}

export interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  specializations?: string[];
  experience: string;
  avatar: string;
  availability: string; // Text description e.g., "Today", "Tomorrow"
  symptoms: string[]; // List of symptoms/needs they treat
  about: string; // Doctor bio
  schedule: DaySchedule[];
  reviews: Review[];
  // Kept optional to prevent breaking references if any, but will not be used in the patient module UI
  rating?: number;
  reviewsCount?: number;
  fee?: string;
}

export interface MedicalNeed {
  id: string;
  label: string;
  iconName: string; // Lucide icon identifier
  specialty: string;
  symptoms: string[];
  description: string;
}
