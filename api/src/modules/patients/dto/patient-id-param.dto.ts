import { IsUUID } from 'class-validator';

export class PatientIdParamDto {
  @IsUUID()
  patientId: string;
}
