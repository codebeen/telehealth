import { Injectable } from '@nestjs/common';
import { AppointmentStatus, Prisma } from '@prisma/client';
import { BookConsultationResponseDto } from '../dto/book-consultation-response.dto';
import {
  PatientAppointmentResponseDto,
  PatientAppointmentStatusDto,
} from '../dto/appointment-response.dto';
import {
  DoctorAppointmentResponseDto,
  DoctorAppointmentStatusDto,
} from '../dto/doctor-appointment-response.dto';

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

export const appointmentPatientInclude = {
  patient: {
    include: {
      user: true,
      profileDetails: true,
    },
  },
} satisfies Prisma.AppointmentInclude;

export type AppointmentWithPatient = Prisma.AppointmentGetPayload<{
  include: typeof appointmentPatientInclude;
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
      consultationType: appointment.consultationType ?? 'Video Consultation',
      visitReason: appointment.reasonForConsultation ?? 'Video consultation booking.',
      roomId:
        appointment.meetingLink ??
        `Consultation Room ${appointment.id.slice(0, 8).toUpperCase()}`,
      cancelReason: appointment.cancellationReason ?? undefined,
    };
  }

  toDoctorAppointmentDto(appointment: AppointmentWithPatient): DoctorAppointmentResponseDto {
    const profile = appointment.patient.profileDetails;

    return {
      id: appointment.id,
      patientId: appointment.patientId,
      patient: this.formatPersonName(profile),
      email: appointment.patient.user.email,
      phone: profile.phoneNumber,
      time: `${this.formatTime(appointment.startTime)} - ${this.formatTime(appointment.endTime)}`,
      date: this.formatDisplayDate(appointment.appointmentDate),
      type: appointment.consultationType ?? 'General Consult',
      consultationType: appointment.consultationType ?? 'General Consult',
      status: this.toDoctorAppointmentStatus(appointment.status),
      visitReason: appointment.reasonForConsultation ?? 'Video consultation booking.',
      avatar: this.getInitials(profile.firstName, profile.lastName),
      meetingLink: appointment.meetingLink ?? undefined,
      rejectionReason: appointment.rejectionReason ?? undefined,
      cancellationReason: appointment.cancellationReason ?? undefined,
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
      consultationType: appointment.consultationType ?? 'Video Consultation',
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

  private formatPersonName(profile: {
    firstName: string;
    middleName?: string | null;
    lastName: string;
    suffix?: string | null;
  }) {
    return [profile.firstName, profile.middleName, profile.lastName, profile.suffix]
      .filter(Boolean)
      .join(' ');
  }

  private formatDate(value: Date) {
    return value.toISOString().split('T')[0];
  }

  private formatDisplayDate(value: Date) {
    return value.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }

  private formatTime(value: Date) {
    const hours = value.getUTCHours();
    const minutes = value.getUTCMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;

    return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  private toPatientAppointmentStatus(status: AppointmentStatus): PatientAppointmentStatusDto {
    if (status === AppointmentStatus.PENDING) {
      return 'Pending';
    }

    if (status === AppointmentStatus.COMPLETED) {
      return 'Completed';
    }

    if (status === AppointmentStatus.CANCELLED || status === AppointmentStatus.REJECTED) {
      return 'Cancelled';
    }

    return 'Upcoming';
  }

  private toDoctorAppointmentStatus(status: AppointmentStatus): DoctorAppointmentStatusDto {
    if (status === AppointmentStatus.CONFIRMED || status === AppointmentStatus.RESCHEDULED) {
      return 'Confirmed';
    }

    if (status === AppointmentStatus.COMPLETED) {
      return 'Completed';
    }

    if (status === AppointmentStatus.CANCELLED) {
      return 'Cancelled';
    }

    if (status === AppointmentStatus.REJECTED) {
      return 'Rejected';
    }

    return 'Pending';
  }

  private getInitials(firstName: string, lastName: string) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
