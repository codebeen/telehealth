import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { AddressDto } from './address.dto';
import { ProfileDetailsDto } from './profile-details.dto';

export class RegisterDoctorDto {
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

  // Doctor-specific fields
  @IsNotEmpty()
  @IsString()
  licenseNumber: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @IsOptional()
  @IsNumber()
  consultationFee?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializationIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializationNames?: string[];
}
