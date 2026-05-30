export type PatientAppointmentStatusDto = 'Upcoming' | 'Completed' | 'Cancelled';

export class PatientAppointmentResponseDto {
  id: string;
  doctorId: string;
  scheduleId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  doctorAbout: string;
  date: string;
  slotStart: string;
  slotEnd: string;
  status: PatientAppointmentStatusDto;
  visitReason: string;
  roomId: string;
  cancelReason?: string;
}
