import { DoctorAppointment } from './appointment';

const INITIAL_APPOINTMENT_DATA: DoctorAppointment[] = [
  { 
    id: '1',
    patientId: 'patient-1',
    patient: 'Alexander Goth', 
    email: 'alexander.goth@example.com', 
    phone: '+1 (555) 019-2834', 
    time: '02:30 PM - 03:00 PM', 
    date: 'May 27, 2026', 
    type: 'Cardio Follow-up', 
    status: 'Confirmed',
    visitReason: 'Routine cardiologist follow-up on morning blood pressure fluctuations and general recovery after mild surgery.',
    avatar: 'AG'
  },
  { 
    id: '2',
    patientId: 'patient-2',
    patient: 'Beatrice Vance', 
    email: 'beatrice.vance@example.com', 
    phone: '+1 (555) 021-9841', 
    time: '03:15 PM - 03:45 PM', 
    date: 'May 27, 2026', 
    type: 'General Consult', 
    status: 'Pending',
    visitReason: 'Experiencing seasonal allergies that are worsening. Needs antihistamine recommendation or prescription refill.',
    avatar: 'BV'
  },
  { 
    id: '3',
    patientId: 'patient-3',
    patient: 'Corbin Dallas', 
    email: 'corbin.dallas@example.com', 
    phone: '+1 (555) 039-4411', 
    time: '04:00 PM - 04:30 PM', 
    date: 'May 27, 2026', 
    type: 'Hypertension Review', 
    status: 'Pending',
    visitReason: 'Regular review of hypertension management progress and assessment of current Lisinopril dosage effectiveness.',
    avatar: 'CD'
  },
  { 
    id: '4',
    patientId: 'patient-4',
    patient: 'Diana Prince', 
    email: 'diana.prince@example.com', 
    phone: '+1 (555) 042-3322', 
    time: '10:00 AM - 10:30 AM', 
    date: 'May 28, 2026', 
    type: 'Skin Check-up', 
    status: 'Confirmed',
    visitReason: 'Check-up of persistent skin dryness and rash on the left wrist which might be contact dermatitis.',
    avatar: 'DP'
  },
  { 
    id: '5',
    patientId: 'patient-5',
    patient: 'Bruce Wayne', 
    email: 'bruce.wayne@example.com', 
    phone: '+1 (555) 088-7711', 
    time: '11:00 AM - 11:30 AM', 
    date: 'May 28, 2026', 
    type: 'Neurological Consultation', 
    status: 'Confirmed',
    visitReason: 'Consultation regarding recurring tension headaches, chronic fatigue, and minor sleep issues.',
    avatar: 'BW'
  },
  { 
    id: '6',
    patientId: 'patient-6',
    patient: 'Ezra Bridger', 
    email: 'ezra.bridger@example.com', 
    phone: '+1 (555) 091-2288', 
    time: '09:00 AM - 09:30 AM', 
    date: 'May 25, 2026', 
    type: 'Diabetes Log Review', 
    status: 'Completed',
    visitReason: 'Review of blood sugar logs, nutrition advice adjustment, and ongoing insulin administration parameters check.',
    avatar: 'EB'
  },
  { 
    id: '7',
    patientId: 'patient-7',
    patient: 'Fiona Gallagher', 
    email: 'fiona.gallagher@example.com', 
    phone: '+1 (555) 044-8899', 
    time: '01:30 PM - 02:00 PM', 
    date: 'May 24, 2026', 
    type: 'Hypertension Review', 
    status: 'Cancelled',
    visitReason: 'Follow-up consultation to check blood pressure spikes during high stress situations.',
    avatar: 'FG'
  }
];

export const APPOINTMENT_DATA: DoctorAppointment[] = [...INITIAL_APPOINTMENT_DATA];

// Load from localStorage if available on client-side
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('doctor_appointments_data');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        APPOINTMENT_DATA.length = 0;
        APPOINTMENT_DATA.push(...parsed);
      }
    } catch (e) {
      console.error('Failed to parse doctor_appointments_data:', e);
    }
  }
}

export function persistAppointmentData() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('doctor_appointments_data', JSON.stringify(APPOINTMENT_DATA));
  }
}
