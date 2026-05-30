import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class BookConsultationDto {
  @IsUUID()
  doctorId: string;

  @IsUUID()
  scheduleId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  consultationType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  reasonForConsultation: string;
}
