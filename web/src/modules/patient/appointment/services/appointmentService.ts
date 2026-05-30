import api from '@/lib/api';
import { getCurrentPatientId } from '@/modules/patient/utils/currentPatient';
import { PatientAppointment } from '../types/appointment';

// Helper to calculate dynamic dates relative to today
export const getRelativeDateString = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const getDisplayDateFormatted = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

export async function fetchPatientAppointments(): Promise<PatientAppointment[]> {
  const patientId = getCurrentPatientId();
  const response = await api.get<PatientAppointment[]>(`/appointments/patient/${patientId}`);
  return response.data;
}

export async function reschedulePatientAppointment(
  appointmentId: string,
  scheduleId: string,
): Promise<PatientAppointment> {
  const patientId = getCurrentPatientId();
  const response = await api.patch<PatientAppointment>(
    `/appointments/patient/${patientId}/${appointmentId}/reschedule`,
    { scheduleId },
  );
  return response.data;
}

export async function cancelPatientAppointment(
  appointmentId: string,
  cancellationReason: string,
): Promise<PatientAppointment> {
  const patientId = getCurrentPatientId();
  const response = await api.patch<PatientAppointment>(
    `/appointments/patient/${patientId}/${appointmentId}/cancel`,
    { cancellationReason },
  );
  return response.data;
}

export const initialAppointments: PatientAppointment[] = [
  {
    id: 'appt-1',
    doctorId: 'doctor-1',
    scheduleId: 'schedule-1',
    doctorName: 'Dr. Evelyn Adams',
    doctorSpecialty: 'Cardiology',
    doctorAvatar: 'EA',
    doctorAbout: 'Dr. Evelyn Adams is a board-certified cardiologist with over a decade of experience treating cardiovascular conditions. She specializes in preventive cardiology and clinical diagnostics.',
    date: getRelativeDateString(1), // Tomorrow
    slotStart: '09:30 AM',
    slotEnd: '10:00 AM',
    status: 'Upcoming',
    consultationType: 'Follow-up Consultation',
    visitReason: 'Follow-up consultation regarding recent ECG scans and minor chest discomfort during exercise.',
    roomId: 'Consultation Room B4'
  },
  {
    id: 'appt-2',
    doctorId: 'doctor-2',
    scheduleId: 'schedule-2',
    doctorName: 'Dr. Sarah Connor',
    doctorSpecialty: 'General Medicine',
    doctorAvatar: 'SC',
    doctorAbout: 'Dr. Sarah Connor is a general practitioner dedicated to offering comprehensive primary care. She focuses on acute illnesses, lifestyle medicine, and general health maintenance.',
    date: getRelativeDateString(-2), // 2 days ago
    slotStart: '02:00 PM',
    slotEnd: '02:30 PM',
    status: 'Completed',
    consultationType: 'General Consultation',
    visitReason: 'Annual wellness exam, checking blood pressure trends, and renewing cholesterol prescription medication.',
    roomId: 'Consultation Room A1'
  },
  {
    id: 'appt-3',
    doctorId: 'doctor-3',
    scheduleId: 'schedule-3',
    doctorName: 'Dr. Diana Prince',
    doctorSpecialty: 'Dermatology',
    doctorAvatar: 'DP',
    doctorAbout: 'Dr. Diana Prince is a dermatologist with specialized training in pediatric dermatology, skin cancers, and aesthetic medicine. She has been practicing for over 15 years.',
    date: getRelativeDateString(3), // In 3 days
    slotStart: '11:00 AM',
    slotEnd: '11:30 AM',
    status: 'Upcoming',
    consultationType: 'Specialist Consultation',
    visitReason: 'Assessment of persistent dry patch skin irritation on the right forearm.',
    roomId: 'Consultation Room C2'
  },
  {
    id: 'appt-4',
    doctorId: 'doctor-4',
    scheduleId: 'schedule-4',
    doctorName: 'Dr. Bruce Wayne',
    doctorSpecialty: 'Neurology',
    doctorAvatar: 'BW',
    doctorAbout: 'Dr. Bruce Wayne is a neurologist specializing in migraine management, neuromuscular disorders, and sleep medicine.',
    date: getRelativeDateString(5), // In 5 days
    slotStart: '03:30 PM',
    slotEnd: '04:00 PM',
    status: 'Cancelled',
    consultationType: 'Specialist Consultation',
    visitReason: 'Neurological consult regarding chronic tension headaches and fatigue.',
    roomId: 'Consultation Room D1',
    cancelReason: 'Emergency business meeting travel overlap.'
  }
];
