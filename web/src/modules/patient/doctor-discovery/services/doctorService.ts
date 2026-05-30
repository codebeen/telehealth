import api from '@/lib/api';
import { Doctor, MedicalNeed } from '../types/doctor';

interface SpecializationResponse {
  id: string;
  name: string;
  description?: string | null;
}

interface BookConsultationPayload {
  doctorId: string;
  scheduleId: string;
  consultationType: string;
  reasonForConsultation: string;
}

export const medicalNeeds: MedicalNeed[] = [
  {
    id: 'heart',
    label: 'Heart & Chest Pain',
    iconName: 'Activity',
    specialty: 'Cardiology',
    symptoms: ['Chest pain', 'Palpitations', 'High blood pressure', 'Shortness of breath'],
    description: 'Chest discomfort, high blood pressure, heart rate irregularities.',
  },
  {
    id: 'child',
    label: 'Child Health / Pediatrics',
    iconName: 'Baby',
    specialty: 'Pediatrics',
    symptoms: ['Child fever', 'Pediatric cough', 'Growth concerns', 'Childhood rash'],
    description: 'Fever, cough, vaccinations, growth & developmental concerns.',
  },
  {
    id: 'skin',
    label: 'Skin Rashes & Acne',
    iconName: 'Sparkles',
    specialty: 'Dermatology',
    symptoms: ['Acne', 'Eczema', 'Moles', 'Skin allergy', 'Hair loss'],
    description: 'Eczema, acne, suspicious moles, hair or nail concerns.',
  },
  {
    id: 'brain',
    label: 'Headache & Nerves',
    iconName: 'Brain',
    specialty: 'Neurology',
    symptoms: ['Chronic headache', 'Migraine', 'Tremors', 'Numbness', 'Dizziness'],
    description: 'Migraines, tremors, chronic dizziness, numbness or memory issues.',
  },
  {
    id: 'general',
    label: 'Flu, Fever & General Care',
    iconName: 'Stethoscope',
    specialty: 'General Medicine',
    symptoms: ['Fever', 'Cough', 'Fatigue', 'Allergies', 'Sore throat'],
    description: 'Common cold, allergies, prescriptions, physical exam follow-ups.',
  },
];

export async function fetchDoctors(): Promise<Doctor[]> {
  const response = await api.get<Doctor[]>('/doctors');
  return response.data;
}

export async function fetchSpecializations(): Promise<string[]> {
  const response = await api.get<SpecializationResponse[]>('/doctors/specializations');
  return response.data.map((specialization) => specialization.name).filter(Boolean);
}

export async function bookConsultation(payload: BookConsultationPayload) {
  const response = await api.post('/appointments/book', payload);
  return response.data;
}

export const getDisplayDateFormatted = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};
