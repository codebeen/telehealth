export interface DoctorAppointment {
  id: string;
  patientId: string;
  patient: string;
  email: string;
  phone: string;
  time: string;
  date: string;
  type: string;
  consultationType?: string;
  status: 'Pending' | 'Confirmed' | 'Rejected' | 'Completed' | 'Cancelled';
  visitReason: string;
  avatar: string;
  meetingLink?: string;
  rejectionReason?: string;
  cancellationReason?: string;
}
