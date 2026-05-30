import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, NotificationType, ScheduleStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { BookConsultationDto } from './dto/book-consultation.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { PatientAppointmentActionParamDto } from './dto/patient-appointment-action-param.dto';
import { PatientAppointmentParamDto } from './dto/patient-appointment-param.dto';
import { PatientAppointmentsQueryDto } from './dto/patient-appointments-query.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { PatientAppointmentResponseDto } from './dto/appointment-response.dto';
import { BookConsultationResponseDto } from './dto/book-consultation-response.dto';
import { DoctorAppointmentResponseDto } from './dto/doctor-appointment-response.dto';
import { DoctorAppointmentActionParamDto } from './dto/doctor-appointment-action-param.dto';
import { DoctorAppointmentParamDto } from './dto/doctor-appointment-param.dto';
import { DoctorAppointmentsQueryDto } from './dto/doctor-appointments-query.dto';
import { RejectAppointmentDto } from './dto/reject-appointment.dto';
import { CompleteAppointmentDto } from './dto/complete-appointment.dto';
import {
  appointmentDoctorInclude,
  appointmentPatientInclude,
  AppointmentResponseMapper,
} from './mappers/appointment-response.mapper';
import { GoogleMeetLinkService } from './services/google-meet-link.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AppointmentService {
  private readonly activeAppointmentStatuses = [
    AppointmentStatus.PENDING,
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.RESCHEDULED,
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly appointmentResponseMapper: AppointmentResponseMapper,
    private readonly googleMeetLinkService: GoogleMeetLinkService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getPatientAppointments(
    userId: string,
    params: PatientAppointmentParamDto,
    dto: PatientAppointmentsQueryDto,
  ): Promise<PatientAppointmentResponseDto[]> {
    const patient = await this.getAuthorizedPatient(userId, params.patientId);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        patientId: patient.id,
        deletedAt: null,
        ...(dto.view === 'upcoming'
          ? { status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.RESCHEDULED] } }
          : {}),
        ...(dto.view === 'past'
          ? {
              status: {
                in: [
                  AppointmentStatus.COMPLETED,
                  AppointmentStatus.CANCELLED,
                  AppointmentStatus.REJECTED,
                ],
              },
            }
          : {}),
      },
      include: appointmentDoctorInclude,
      orderBy: [
        { appointmentDate: 'asc' },
        { startTime: 'asc' },
      ],
    });

    return appointments.map((appointment) =>
      this.appointmentResponseMapper.toPatientAppointmentDto(appointment),
    );
  }

  async bookConsultation(
    userId: string,
    dto: BookConsultationDto,
  ): Promise<BookConsultationResponseDto> {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new ForbiddenException('Only patients can book consultations');
    }

    const consultationType = dto.consultationType.trim();
    const reasonForConsultation = dto.reasonForConsultation.trim();

    if (!consultationType) {
      throw new BadRequestException('Consultation type is required');
    }

    if (!reasonForConsultation) {
      throw new BadRequestException('Reason for consultation is required');
    }

    const bookedAppointment = await this.prisma.$transaction(async (tx) => {
      const schedule = await tx.doctorSchedule.findUnique({
        where: { id: dto.scheduleId },
        include: {
          appointments: {
            where: {
              deletedAt: null,
              status: { in: this.activeAppointmentStatuses },
            },
            take: 1,
          },
          doctor: true,
        },
      });

      if (!schedule || schedule.deletedAt) {
        throw new NotFoundException('Schedule slot not found');
      }

      if (schedule.doctorId !== dto.doctorId) {
        throw new BadRequestException('Schedule slot does not belong to the selected doctor');
      }

      if (!schedule.startTime || !schedule.endTime) {
        throw new BadRequestException('This schedule slot is not bookable');
      }

      if (schedule.status !== ScheduleStatus.AVAILABLE || schedule.appointments.length > 0) {
        throw new ConflictException('This schedule slot is no longer available');
      }

      const appointment = await tx.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: schedule.doctorId,
          scheduleId: schedule.id,
          appointmentDate: schedule.scheduleDate,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          consultationType,
          reasonForConsultation,
          status: AppointmentStatus.PENDING,
          statusHistories: {
            create: {
              status: AppointmentStatus.PENDING,
              changedById: userId,
              notes: 'Consultation booked by patient',
            },
          },
        },
        include: appointmentDoctorInclude,
      });

      await tx.doctorSchedule.update({
        where: { id: schedule.id },
        data: {
          status: ScheduleStatus.BOOKED,
        },
      });

      return this.appointmentResponseMapper.toBookConsultationDto(appointment);
    });

    await this.notifyAppointmentUsers(bookedAppointment.id, {
      doctor: {
        title: 'New appointment booked',
        message: `A patient booked a ${bookedAppointment.consultationType} appointment for ${bookedAppointment.appointmentDate} at ${bookedAppointment.startTime}.`,
        type: NotificationType.BOOKED,
      },
      patient: {
        title: 'Appointment request sent',
        message: `Your appointment request with ${bookedAppointment.doctor.name} is pending doctor confirmation.`,
        type: NotificationType.BOOKED,
      },
    });

    return bookedAppointment;
  }

  async rescheduleAppointment(
    userId: string,
    params: PatientAppointmentActionParamDto,
    dto: RescheduleAppointmentDto,
  ): Promise<PatientAppointmentResponseDto> {
    const patient = await this.getAuthorizedPatient(userId, params.patientId);

    const rescheduledAppointment = await this.prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.findFirst({
        where: {
          id: params.appointmentId,
          patientId: patient.id,
          deletedAt: null,
        },
        include: appointmentDoctorInclude,
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      if (
        appointment.status === AppointmentStatus.CANCELLED ||
        appointment.status === AppointmentStatus.COMPLETED
      ) {
        throw new ConflictException('This appointment can no longer be rescheduled');
      }

      if (appointment.scheduleId === dto.scheduleId) {
        throw new BadRequestException('Please choose a different schedule slot');
      }

      const newSchedule = await tx.doctorSchedule.findUnique({
        where: { id: dto.scheduleId },
        include: {
          appointments: {
            where: {
              deletedAt: null,
              status: { in: this.activeAppointmentStatuses },
            },
            take: 1,
          },
        },
      });

      if (!newSchedule || newSchedule.deletedAt) {
        throw new NotFoundException('New schedule slot not found');
      }

      if (newSchedule.doctorId !== appointment.doctorId) {
        throw new BadRequestException('Reschedule slot must belong to the same doctor');
      }

      if (!newSchedule.startTime || !newSchedule.endTime) {
        throw new BadRequestException('This schedule slot is not bookable');
      }

      if (newSchedule.status !== ScheduleStatus.AVAILABLE || newSchedule.appointments.length > 0) {
        throw new ConflictException('This schedule slot is no longer available');
      }

      await tx.doctorSchedule.update({
        where: { id: appointment.scheduleId },
        data: { status: ScheduleStatus.AVAILABLE },
      });

      await tx.doctorSchedule.update({
        where: { id: newSchedule.id },
        data: { status: ScheduleStatus.BOOKED },
      });

      const updatedAppointment = await tx.appointment.update({
        where: { id: appointment.id },
        data: {
          scheduleId: newSchedule.id,
          appointmentDate: newSchedule.scheduleDate,
          startTime: newSchedule.startTime,
          endTime: newSchedule.endTime,
          status: AppointmentStatus.RESCHEDULED,
          statusHistories: {
            create: {
              status: AppointmentStatus.RESCHEDULED,
              changedById: userId,
              notes: dto.reasonForReschedule ?? 'Appointment rescheduled by patient',
            },
          },
        },
        include: appointmentDoctorInclude,
      });

      return this.appointmentResponseMapper.toPatientAppointmentDto(updatedAppointment);
    });

    await this.notifyAppointmentUsers(rescheduledAppointment.id, {
      doctor: {
        title: 'Appointment rescheduled',
        message: `A patient rescheduled an appointment to ${rescheduledAppointment.date} at ${rescheduledAppointment.slotStart}.`,
        type: NotificationType.RESCHEDULED,
      },
      patient: {
        title: 'Schedule updated',
        message: `Your appointment with ${rescheduledAppointment.doctorName} was moved to ${rescheduledAppointment.date} at ${rescheduledAppointment.slotStart}.`,
        type: NotificationType.RESCHEDULED,
      },
    });

    return rescheduledAppointment;
  }

  async cancelAppointment(
    userId: string,
    params: PatientAppointmentActionParamDto,
    dto: CancelAppointmentDto,
  ): Promise<PatientAppointmentResponseDto> {
    const patient = await this.getAuthorizedPatient(userId, params.patientId);

    const cancelledAppointment = await this.prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.findFirst({
        where: {
          id: params.appointmentId,
          patientId: patient.id,
          deletedAt: null,
        },
        include: appointmentDoctorInclude,
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      if (appointment.status === AppointmentStatus.CANCELLED) {
        throw new ConflictException('This appointment is already cancelled');
      }

      if (appointment.status === AppointmentStatus.COMPLETED) {
        throw new ConflictException('Completed appointments cannot be cancelled');
      }

      await tx.doctorSchedule.update({
        where: { id: appointment.scheduleId },
        data: { status: ScheduleStatus.AVAILABLE },
      });

      const updatedAppointment = await tx.appointment.update({
        where: { id: appointment.id },
        data: {
          status: AppointmentStatus.CANCELLED,
          cancellationReason: dto.cancellationReason?.trim() || 'No reason provided.',
          cancelledById: userId,
          statusHistories: {
            create: {
              status: AppointmentStatus.CANCELLED,
              changedById: userId,
              notes: dto.cancellationReason?.trim() || 'Cancelled by patient',
            },
          },
        },
        include: appointmentDoctorInclude,
      });

      return this.appointmentResponseMapper.toPatientAppointmentDto(updatedAppointment);
    });

    await this.notifyAppointmentUsers(cancelledAppointment.id, {
      doctor: {
        title: 'Appointment cancelled',
        message: `A patient cancelled the appointment scheduled for ${cancelledAppointment.date} at ${cancelledAppointment.slotStart}.`,
        type: NotificationType.CANCELLED,
      },
      patient: {
        title: 'Appointment cancelled',
        message: `Your appointment with ${cancelledAppointment.doctorName} has been cancelled.`,
        type: NotificationType.CANCELLED,
      },
    });

    return cancelledAppointment;
  }

  async getDoctorAppointments(
    userId: string,
    params: DoctorAppointmentParamDto,
    dto: DoctorAppointmentsQueryDto,
  ): Promise<DoctorAppointmentResponseDto[]> {
    const doctor = await this.getAuthorizedDoctor(userId, params.doctorId);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        deletedAt: null,
        ...(dto.view === 'upcoming'
          ? {
              status: {
                in: [
                  AppointmentStatus.PENDING,
                  AppointmentStatus.CONFIRMED,
                  AppointmentStatus.RESCHEDULED,
                ],
              },
            }
          : {}),
        ...(dto.view === 'past'
          ? {
              status: {
                in: [
                  AppointmentStatus.COMPLETED,
                  AppointmentStatus.CANCELLED,
                  AppointmentStatus.REJECTED,
                ],
              },
            }
          : {}),
      },
      include: appointmentPatientInclude,
      orderBy: [{ appointmentDate: 'asc' }, { startTime: 'asc' }],
    });

    return appointments.map((appointment) =>
      this.appointmentResponseMapper.toDoctorAppointmentDto(appointment),
    );
  }

  async acceptAppointment(
    userId: string,
    params: DoctorAppointmentActionParamDto,
  ): Promise<DoctorAppointmentResponseDto> {
    const doctor = await this.getAuthorizedDoctor(userId, params.doctorId);

    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: params.appointmentId,
        doctorId: doctor.id,
        deletedAt: null,
      },
      include: appointmentPatientInclude,
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new ConflictException('Only pending appointments can be accepted');
    }

    const meetingLink =
      appointment.meetingLink ??
      (await this.googleMeetLinkService.createMeetLink({
        summary: `Telehealth Consultation - ${appointment.patient.profileDetails.firstName} ${appointment.patient.profileDetails.lastName}`,
        description: appointment.reasonForConsultation ?? undefined,
        startDateTime: this.toCalendarDateTime(
          appointment.appointmentDate,
          appointment.startTime,
        ),
        endDateTime: this.toCalendarDateTime(
          appointment.appointmentDate,
          appointment.endTime,
        ),
        timeZone: process.env.GOOGLE_CALENDAR_TIMEZONE || 'Asia/Singapore',
        attendeeEmails: [appointment.patient.user.email],
      }));

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        status: AppointmentStatus.CONFIRMED,
        meetingLink,
        statusHistories: {
          create: {
            status: AppointmentStatus.CONFIRMED,
            changedById: userId,
            notes: 'Appointment accepted by doctor. Google Meet link generated.',
          },
        },
      },
      include: appointmentPatientInclude,
    });

    const dto = this.appointmentResponseMapper.toDoctorAppointmentDto(updatedAppointment);
    await this.notificationsService.create({
      userId: updatedAppointment.patient.userId,
      appointmentId: updatedAppointment.id,
      title: 'Appointment confirmed',
      message: `Your ${dto.consultationType} appointment on ${dto.date} is confirmed. You can now join using the meeting link.`,
      type: NotificationType.UPCOMING,
    });

    return dto;
  }

  async rejectAppointment(
    userId: string,
    params: DoctorAppointmentActionParamDto,
    dto: RejectAppointmentDto,
  ): Promise<DoctorAppointmentResponseDto> {
    const doctor = await this.getAuthorizedDoctor(userId, params.doctorId);
    const rejectionReason = dto.rejectionReason.trim();

    if (!rejectionReason) {
      throw new BadRequestException('Rejection reason is required');
    }

    const rejectedAppointment = await this.prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.findFirst({
        where: {
          id: params.appointmentId,
          doctorId: doctor.id,
          deletedAt: null,
        },
        include: appointmentPatientInclude,
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      if (appointment.status !== AppointmentStatus.PENDING) {
        throw new ConflictException('Only pending appointments can be rejected');
      }

      await tx.doctorSchedule.update({
        where: { id: appointment.scheduleId },
        data: { status: ScheduleStatus.AVAILABLE },
      });

      const updatedAppointment = await tx.appointment.update({
        where: { id: appointment.id },
        data: {
          status: AppointmentStatus.REJECTED,
          rejectionReason,
          statusHistories: {
            create: {
              status: AppointmentStatus.REJECTED,
              changedById: userId,
              notes: rejectionReason,
            },
          },
        },
        include: appointmentPatientInclude,
      });

      return this.appointmentResponseMapper.toDoctorAppointmentDto(updatedAppointment);
    });

    await this.notifyAppointmentUsers(rejectedAppointment.id, {
      patient: {
        title: 'Appointment request declined',
        message: `Your ${rejectedAppointment.consultationType} appointment request was declined. Reason: ${rejectionReason}`,
        type: NotificationType.CANCELLED,
      },
    });

    return rejectedAppointment;
  }

  async cancelDoctorAppointment(
    userId: string,
    params: DoctorAppointmentActionParamDto,
    dto: CancelAppointmentDto,
  ): Promise<DoctorAppointmentResponseDto> {
    const doctor = await this.getAuthorizedDoctor(userId, params.doctorId);
    const cancellationReason = dto.cancellationReason?.trim();

    if (!cancellationReason) {
      throw new BadRequestException('Cancellation reason is required');
    }

    const cancelledAppointment = await this.prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.findFirst({
        where: {
          id: params.appointmentId,
          doctorId: doctor.id,
          deletedAt: null,
        },
        include: appointmentPatientInclude,
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      if (appointment.status === AppointmentStatus.CANCELLED) {
        throw new ConflictException('This appointment is already cancelled');
      }

      if (
        appointment.status === AppointmentStatus.COMPLETED ||
        appointment.status === AppointmentStatus.REJECTED
      ) {
        throw new ConflictException('This appointment can no longer be cancelled');
      }

      await tx.doctorSchedule.update({
        where: { id: appointment.scheduleId },
        data: { status: ScheduleStatus.AVAILABLE },
      });

      const updatedAppointment = await tx.appointment.update({
        where: { id: appointment.id },
        data: {
          status: AppointmentStatus.CANCELLED,
          cancellationReason,
          cancelledById: userId,
          statusHistories: {
            create: {
              status: AppointmentStatus.CANCELLED,
              changedById: userId,
              notes: cancellationReason,
            },
          },
        },
        include: appointmentPatientInclude,
      });

      return this.appointmentResponseMapper.toDoctorAppointmentDto(updatedAppointment);
    });

    await this.notifyAppointmentUsers(cancelledAppointment.id, {
      patient: {
        title: 'Appointment cancelled by doctor',
        message: `Your ${cancelledAppointment.consultationType} appointment on ${cancelledAppointment.date} was cancelled. Reason: ${cancellationReason}`,
        type: NotificationType.CANCELLED,
      },
    });

    return cancelledAppointment;
  }

  async completeAppointment(
    userId: string,
    params: DoctorAppointmentActionParamDto,
    dto: CompleteAppointmentDto,
  ): Promise<DoctorAppointmentResponseDto> {
    const doctor = await this.getAuthorizedDoctor(userId, params.doctorId);
    const consultationType = dto.consultationType.trim();
    const clinicalFindings = dto.clinicalFindings.trim();
    const recommendations = dto.recommendations.trim();
    const medicationPrescriptions = dto.medicationPrescriptions?.trim();
    const finalSummary = dto.finalSummary?.trim();

    if (!consultationType) {
      throw new BadRequestException('Consultation type is required');
    }

    if (!clinicalFindings) {
      throw new BadRequestException('Clinical findings are required');
    }

    if (!recommendations) {
      throw new BadRequestException('Recommendations and advice are required');
    }

    const completedAppointment = await this.prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.findFirst({
        where: {
          id: params.appointmentId,
          doctorId: doctor.id,
          deletedAt: null,
        },
        include: appointmentPatientInclude,
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      if (
        appointment.status !== AppointmentStatus.CONFIRMED &&
        appointment.status !== AppointmentStatus.RESCHEDULED
      ) {
        throw new ConflictException('Only confirmed appointments can be completed');
      }

      await tx.medicalRecord.upsert({
        where: { appointmentId: appointment.id },
        create: {
          appointmentId: appointment.id,
          doctorId: appointment.doctorId,
          patientId: appointment.patientId,
          consultationType,
          clinicalFindings,
          recommendations,
          medicationSummary: medicationPrescriptions || null,
          finalSummary: finalSummary || null,
          diagnosis: clinicalFindings,
          consultationNotes: recommendations,
        },
        update: {
          consultationType,
          clinicalFindings,
          recommendations,
          medicationSummary: medicationPrescriptions || null,
          finalSummary: finalSummary || null,
          diagnosis: clinicalFindings,
          consultationNotes: recommendations,
        },
      });

      const updatedAppointment = await tx.appointment.update({
        where: { id: appointment.id },
        data: {
          status: AppointmentStatus.COMPLETED,
          statusHistories: {
            create: {
              status: AppointmentStatus.COMPLETED,
              changedById: userId,
              notes: 'Appointment marked as completed by doctor with consultation record.',
            },
          },
        },
        include: appointmentPatientInclude,
      });

      return this.appointmentResponseMapper.toDoctorAppointmentDto(updatedAppointment);
    });

    await this.notifyAppointmentUsers(completedAppointment.id, {
      patient: {
        title: 'Consultation record available',
        message: `Your ${completedAppointment.consultationType} consultation record is now available in Medical Records.`,
        type: NotificationType.UPCOMING,
      },
    });

    return completedAppointment;
  }

  private async getAuthorizedPatient(userId: string, patientId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
        userId,
        deletedAt: null,
      },
    });

    if (!patient) {
      throw new ForbiddenException('You can only access your own patient appointments');
    }

    return patient;
  }

  private async getAuthorizedDoctor(userId: string, doctorId: string) {
    const doctor = await this.prisma.doctor.findFirst({
      where: {
        id: doctorId,
        userId,
        deletedAt: null,
      },
    });

    if (!doctor) {
      throw new ForbiddenException('You can only access your own doctor appointments');
    }

    return doctor;
  }

  private async notifyAppointmentUsers(
    appointmentId: string,
    notifications: {
      patient?: { title: string; message: string; type: NotificationType };
      doctor?: { title: string; message: string; type: NotificationType };
    },
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!appointment) return;

    await Promise.all([
      notifications.patient
        ? this.notificationsService.create({
            userId: appointment.patient.userId,
            appointmentId: appointment.id,
            ...notifications.patient,
          })
        : Promise.resolve(),
      notifications.doctor
        ? this.notificationsService.create({
            userId: appointment.doctor.userId,
            appointmentId: appointment.id,
            ...notifications.doctor,
          })
        : Promise.resolve(),
    ]);
  }

  private toCalendarDateTime(date: Date, time: Date) {
    const datePart = date.toISOString().split('T')[0];
    const timePart = [
      String(time.getUTCHours()).padStart(2, '0'),
      String(time.getUTCMinutes()).padStart(2, '0'),
      '00',
    ].join(':');

    return `${datePart}T${timePart}`;
  }
}
