import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MedicalRecordsService } from './medical-records.service';

@Controller('medical-records')
@UseGuards(JwtAuthGuard)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Get('patient/:patientId')
  getPatientConsultationRecords(@Request() req, @Param('patientId') patientId: string) {
    return this.medicalRecordsService.getPatientConsultationRecords(req.user.sub, patientId);
  }

  @Get('patient/:patientId/:recordId')
  getPatientConsultationRecord(
    @Request() req,
    @Param('patientId') patientId: string,
    @Param('recordId') recordId: string,
  ) {
    return this.medicalRecordsService.getPatientConsultationRecord(
      req.user.sub,
      patientId,
      recordId,
    );
  }
}
