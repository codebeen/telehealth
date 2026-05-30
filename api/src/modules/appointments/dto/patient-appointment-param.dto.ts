import { IsUUID } from 'class-validator';

export class PatientAppointmentParamDto {
  @IsUUID()
  patientId: string;
}
