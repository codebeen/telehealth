import { IsUUID } from 'class-validator';

export class PatientAppointmentActionParamDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  appointmentId: string;
}
