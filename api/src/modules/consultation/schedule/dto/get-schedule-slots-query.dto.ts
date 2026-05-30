import { IsDateString } from 'class-validator';

export class GetScheduleSlotsQueryDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
