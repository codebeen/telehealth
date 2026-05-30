import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ProfileDetailsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  middleName?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  suffix?: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  gender: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  phoneNumber: string;
}
