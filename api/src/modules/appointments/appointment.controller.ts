import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentService } from './appointment.service';
import { BookConsultationDto } from './dto/book-consultation.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { PatientAppointmentActionParamDto } from './dto/patient-appointment-action-param.dto';
import { PatientAppointmentParamDto } from './dto/patient-appointment-param.dto';
import { PatientAppointmentsQueryDto } from './dto/patient-appointments-query.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { DoctorAppointmentParamDto } from './dto/doctor-appointment-param.dto';
import { DoctorAppointmentsQueryDto } from './dto/doctor-appointments-query.dto';
import { DoctorAppointmentActionParamDto } from './dto/doctor-appointment-action-param.dto';
import { RejectAppointmentDto } from './dto/reject-appointment.dto';

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

  @Get('doctor/:doctorId')
  getDoctorAppointments(
    @Request() req,
    @Param() params: DoctorAppointmentParamDto,
    @Query() query: DoctorAppointmentsQueryDto,
  ) {
    return this.appointmentService.getDoctorAppointments(req.user.sub, params, query);
  }

  @Patch('doctor/:doctorId/:appointmentId/accept')
  @HttpCode(HttpStatus.OK)
  acceptAppointment(
    @Request() req,
    @Param() params: DoctorAppointmentActionParamDto,
  ) {
    return this.appointmentService.acceptAppointment(req.user.sub, params);
  }

  @Patch('doctor/:doctorId/:appointmentId/reject')
  @HttpCode(HttpStatus.OK)
  rejectAppointment(
    @Request() req,
    @Param() params: DoctorAppointmentActionParamDto,
    @Body() dto: RejectAppointmentDto,
  ) {
    return this.appointmentService.rejectAppointment(req.user.sub, params, dto);
  }

  @Patch('doctor/:doctorId/:appointmentId/cancel')
  @HttpCode(HttpStatus.OK)
  cancelDoctorAppointment(
    @Request() req,
    @Param() params: DoctorAppointmentActionParamDto,
    @Body() dto: CancelAppointmentDto,
  ) {
    return this.appointmentService.cancelDoctorAppointment(req.user.sub, params, dto);
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
