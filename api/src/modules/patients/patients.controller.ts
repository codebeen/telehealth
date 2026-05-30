import { Controller, Get, Patch, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get(':patientId/profile')
  @UseGuards(JwtAuthGuard)
  async getPatientProfile(
    @Request() req,
    @Param('patientId') patientId: string,
  ) {
    return this.patientsService.getPatientProfile(req.user.sub, patientId);
  }

  @Patch(':patientId/profile')
  @UseGuards(JwtAuthGuard)
  async updatePatientProfile(
    @Request() req,
    @Param('patientId') patientId: string,
    @Body() dto: any,
  ) {
    return this.patientsService.updatePatientProfile(req.user.sub, patientId, dto);
  }
}
