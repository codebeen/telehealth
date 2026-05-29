export interface DoctorAppointment {
  id: number;
  patient: string;
  email: string;
  phone: string;
  time: string;
  date: string;
  type: string;
  status: 'Pending' | 'Confirmed' | 'Rejected' | 'Completed' | 'Cancelled';
  visitReason: string;
  avatar: string;
}
