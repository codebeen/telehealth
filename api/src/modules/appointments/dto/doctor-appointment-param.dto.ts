import { IsUUID } from 'class-validator';

export class DoctorAppointmentParamDto {
  @IsUUID()
  doctorId: string;
}
