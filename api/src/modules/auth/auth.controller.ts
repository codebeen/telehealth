import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/patient')
  @HttpCode(HttpStatus.CREATED)
  async registerPatient(@Body() registerPatientDto: RegisterPatientDto) {
    return this.authService.registerPatient(registerPatientDto);
  }

  @Post('register/doctor')
  @HttpCode(HttpStatus.CREATED)
  async registerDoctor(@Body() registerDoctorDto: RegisterDoctorDto) {
    return this.authService.registerDoctor(registerDoctorDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
