export class BookedDoctorResponseDto {
  id: string;
  name: string;
  specialty: string;
}

export class BookConsultationResponseDto {
  id: string;
  status: string;
  doctorId: string;
  scheduleId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  reasonForConsultation?: string | null;
  doctor: BookedDoctorResponseDto;
}
