import { IsUUID } from 'class-validator';

export class DoctorAppointmentActionParamDto {
  @IsUUID()
  doctorId: string;

  @IsUUID()
  appointmentId: string;
}
