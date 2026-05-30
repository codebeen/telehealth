import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateAllergyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
