import { IsIn, IsOptional } from 'class-validator';

export class DoctorAppointmentsQueryDto {
  @IsOptional()
  @IsIn(['all', 'upcoming', 'past'])
  view?: 'all' | 'upcoming' | 'past';
}
