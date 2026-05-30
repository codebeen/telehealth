import { IsString, MaxLength } from 'class-validator';

export class RejectAppointmentDto {
  @IsString()
  @MaxLength(1000)
  rejectionReason: string;
}
