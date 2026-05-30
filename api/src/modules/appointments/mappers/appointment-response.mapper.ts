import { Injectable } from '@nestjs/common';
import { AppointmentStatus, Prisma } from '@prisma/client';
import { BookConsultationResponseDto } from '../dto/book-consultation-response.dto';
import {
  PatientAppointmentResponseDto,
  PatientAppointmentStatusDto,
} from '../dto/appointment-response.dto';

export const appointmentDoctorInclude = {
  doctor: {
    include: {
      profileDetails: true,
      doctorSpecializations: {
        include: {
          specialization: true,
        },
      },
    },
  },
} satisfies Prisma.AppointmentInclude;

export type AppointmentWithDoctor = Prisma.AppointmentGetPayload<{
  include: typeof appointmentDoctorInclude;
}>;

@Injectable()
export class AppointmentResponseMapper {
  toPatientAppointmentDto(appointment: AppointmentWithDoctor): PatientAppointmentResponseDto {
    const profile = appointment.doctor.profileDetails;
    const specialty =
      appointment.doctor.doctorSpecializations[0]?.specialization.name ?? 'General Medicine';

    return {
      id: appointment.id,
      doctorId: appointment.doctorId,
      scheduleId: appointment.scheduleId,
      doctorName: this.formatDoctorName(profile),
      doctorSpecialty: specialty,
      doctorAvatar: `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase(),
      doctorAbout: appointment.doctor.bio ?? 'No biography provided yet.',
      date: this.formatDate(appointment.appointmentDate),
      slotStart: this.formatTime(appointment.startTime),
      slotEnd: this.formatTime(appointment.endTime),
      status: this.toPatientAppointmentStatus(appointment.status),
      visitReason: appointment.reasonForConsultation ?? 'Video consultation booking.',
      roomId:
        appointment.meetingLink ??
        `Consultation Room ${appointment.id.slice(0, 8).toUpperCase()}`,
      cancelReason: appointment.cancellationReason ?? undefined,
    };
  }

  toBookConsultationDto(appointment: AppointmentWithDoctor): BookConsultationResponseDto {
    const profile = appointment.doctor.profileDetails;

    return {
      id: appointment.id,
      status: appointment.status,
      doctorId: appointment.doctorId,
      scheduleId: appointment.scheduleId,
      appointmentDate: this.formatDate(appointment.appointmentDate),
      startTime: this.formatTime(appointment.startTime),
      endTime: this.formatTime(appointment.endTime),
      reasonForConsultation: appointment.reasonForConsultation,
      doctor: {
        id: appointment.doctor.id,
        name: this.formatDoctorName(profile),
        specialty:
          appointment.doctor.doctorSpecializations[0]?.specialization.name ??
          'General Medicine',
      },
    };
  }

  private formatDoctorName(profile: {
    firstName: string;
    middleName?: string | null;
    lastName: string;
    suffix?: string | null;
  }) {
    return `Dr. ${[profile.firstName, profile.middleName, profile.lastName, profile.suffix]
      .filter(Boolean)
      .join(' ')}`;
  }

  private formatDate(value: Date) {
    return value.toISOString().split('T')[0];
  }

  private formatTime(value: Date) {
    const hours = value.getUTCHours();
    const minutes = value.getUTCMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;

    return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  private toPatientAppointmentStatus(status: AppointmentStatus): PatientAppointmentStatusDto {
    if (status === AppointmentStatus.COMPLETED) {
      return 'Completed';
    }

    if (status === AppointmentStatus.CANCELLED) {
      return 'Cancelled';
    }

    return 'Upcoming';
  }
}
