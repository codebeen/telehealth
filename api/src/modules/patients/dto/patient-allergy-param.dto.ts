import { IsUUID } from 'class-validator';

export class PatientAllergyParamDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  allergyId: string;
}
