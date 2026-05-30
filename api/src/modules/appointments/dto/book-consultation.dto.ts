import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class BookConsultationDto {
  @IsUUID()
  doctorId: string;

  @IsUUID()
  scheduleId: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reasonForConsultation?: string;
}
