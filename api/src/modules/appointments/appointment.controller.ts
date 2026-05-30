import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentService } from './appointment.service';
import { BookConsultationDto } from './dto/book-consultation.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { PatientAppointmentActionParamDto } from './dto/patient-appointment-action-param.dto';
import { PatientAppointmentParamDto } from './dto/patient-appointment-param.dto';
import { PatientAppointmentsQueryDto } from './dto/patient-appointments-query.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('patient/:patientId')
  getPatientAppointments(
    @Request() req,
    @Param() params: PatientAppointmentParamDto,
    @Query() query: PatientAppointmentsQueryDto,
  ) {
    return this.appointmentService.getPatientAppointments(req.user.sub, params, query);
  }

  @Post('book')
  @HttpCode(HttpStatus.CREATED)
  bookConsultation(@Request() req, @Body() dto: BookConsultationDto) {
    return this.appointmentService.bookConsultation(req.user.sub, dto);
  }

  @Patch('patient/:patientId/:appointmentId/reschedule')
  @HttpCode(HttpStatus.OK)
  rescheduleAppointment(
    @Request() req,
    @Param() params: PatientAppointmentActionParamDto,
    @Body() dto: RescheduleAppointmentDto,
  ) {
    return this.appointmentService.rescheduleAppointment(req.user.sub, params, dto);
  }

  @Patch('patient/:patientId/:appointmentId/cancel')
  @HttpCode(HttpStatus.OK)
  cancelAppointment(
    @Request() req,
    @Param() params: PatientAppointmentActionParamDto,
    @Body() dto: CancelAppointmentDto,
  ) {
    return this.appointmentService.cancelAppointment(req.user.sub, params, dto);
  }
}
