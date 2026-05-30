import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePatientConsultationRecordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  consultationType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  clinicalFindings: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  recommendations: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  medicationPrescriptions?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  finalSummary?: string;
}
