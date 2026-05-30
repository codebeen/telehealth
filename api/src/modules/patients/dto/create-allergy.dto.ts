import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAllergyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
