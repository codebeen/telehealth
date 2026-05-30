import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  streetLine1: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  streetLine2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  barangay?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  province?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  zipCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;
}
