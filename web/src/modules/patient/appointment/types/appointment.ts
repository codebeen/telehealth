export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export interface PatientAppointment {
  id: string;
  doctorId: string;
  scheduleId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  doctorAbout: string;
  date: string; // e.g. "2026-05-30"
  slotStart: string; // e.g. "10:00 AM"
  slotEnd: string; // e.g. "10:30 AM"
  status: AppointmentStatus;
  visitReason: string;
  roomId: string;
  cancelReason?: string;
}
