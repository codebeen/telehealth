import { MedicalHistoryStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMedicalHistoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  conditionName?: string;

  @IsOptional()
  @IsDateString()
  diagnosedDate?: string;

  @IsOptional()
  @IsEnum(MedicalHistoryStatus)
  status?: MedicalHistoryStatus;

  @IsOptional()
  @IsString()
  description?: string;
}
