import { Body, Controller, Get, Param, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { GetDoctorsQueryDto } from './dto/get-doctors-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePatientConsultationRecordDto } from './dto/update-patient-consultation-record.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  async getDoctors(@Query() query: GetDoctorsQueryDto) {
    return this.doctorsService.getDoctorsWithSchedules(query);
  }

  @Get('specializations')
  async getSpecializations() {
    return this.doctorsService.getSpecializations();
  }

  @Get(':doctorId/dashboard')
  @UseGuards(JwtAuthGuard)
  async getDoctorDashboard(
    @Request() req,
    @Param('doctorId') doctorId: string,
  ) {
    return this.doctorsService.getDoctorDashboard(req.user.sub, doctorId);
  }

  @Get(':doctorId/profile')
  @UseGuards(JwtAuthGuard)
  async getDoctorProfile(
    @Request() req,
    @Param('doctorId') doctorId: string,
  ) {
    return this.doctorsService.getDoctorProfile(req.user.sub, doctorId);
  }

  @Patch(':doctorId/profile')
  @UseGuards(JwtAuthGuard)
  async updateDoctorProfile(
    @Request() req,
    @Param('doctorId') doctorId: string,
    @Body() dto: any,
  ) {
    return this.doctorsService.updateDoctorProfile(req.user.sub, doctorId, dto);
  }

  @Get(':doctorId/patients/completed')
  @UseGuards(JwtAuthGuard)
  async getCompletedConsultationPatients(
    @Request() req,
    @Param('doctorId') doctorId: string,
  ) {
    return this.doctorsService.getCompletedConsultationPatients(req.user.sub, doctorId);
  }

  @Patch(':doctorId/patients/:patientId/records/:recordId')
  @UseGuards(JwtAuthGuard)
  async updatePatientConsultationRecord(
    @Request() req,
    @Param('doctorId') doctorId: string,
    @Param('patientId') patientId: string,
    @Param('recordId') recordId: string,
    @Body() dto: UpdatePatientConsultationRecordDto,
  ) {
    return this.doctorsService.updatePatientConsultationRecord(
      req.user.sub,
      doctorId,
      patientId,
      recordId,
      dto,
    );
  }
}
