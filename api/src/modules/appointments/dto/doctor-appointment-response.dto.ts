export type DoctorAppointmentStatusDto =
  | 'Pending'
  | 'Confirmed'
  | 'Rejected'
  | 'Completed'
  | 'Cancelled';

export class DoctorAppointmentResponseDto {
  id: string;
  patientId: string;
  patient: string;
  email: string;
  phone: string;
  time: string;
  date: string;
  type: string;
  consultationType: string;
  status: DoctorAppointmentStatusDto;
  visitReason: string;
  avatar: string;
  meetingLink?: string;
  rejectionReason?: string;
  cancellationReason?: string;
}
