export class DoctorScheduleSlotResponseDto {
  id: string;
  start: string;
  end: string;
  isBooked: boolean;
}

export class DoctorDayScheduleResponseDto {
  date: string;
  slots: DoctorScheduleSlotResponseDto[];
}

export class DoctorResponseDto {
  id: string;
  name: string;
  specialty: string;
  specializations: string[];
  experience: string;
  avatar: string;
  availability: string;
  symptoms: string[];
  about: string;
  schedule: DoctorDayScheduleResponseDto[];
  reviews: unknown[];
  fee?: string;
}
