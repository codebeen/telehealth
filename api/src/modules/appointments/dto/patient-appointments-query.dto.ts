import { IsIn, IsOptional } from 'class-validator';

export class PatientAppointmentsQueryDto {
  @IsOptional()
  @IsIn(['all', 'upcoming', 'past'])
  view?: 'all' | 'upcoming' | 'past';
}
