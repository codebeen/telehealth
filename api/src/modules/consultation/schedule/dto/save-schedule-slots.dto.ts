import { IsObject } from 'class-validator';

export class SaveScheduleSlotsDto {
  @IsObject()
  slots: Record<string, any>;
}
