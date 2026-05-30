import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class RescheduleAppointmentDto {
  @IsUUID()
  scheduleId: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reasonForReschedule?: string;
}
