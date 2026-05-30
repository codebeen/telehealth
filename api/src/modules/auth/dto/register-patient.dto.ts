import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { AddressDto } from './address.dto';
import { ProfileDetailsDto } from './profile-details.dto';

export class RegisterPatientDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 100, { message: 'Password must be between 8 and 100 characters' })
  password: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProfileDetailsDto)
  profile: ProfileDetailsDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  // Patient-specific fields
  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsString()
  bloodType?: string;

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyContactNumber?: string;
}
