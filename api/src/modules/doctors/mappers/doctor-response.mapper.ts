import { Injectable } from '@nestjs/common';
import { AppointmentStatus, Prisma, ScheduleStatus } from '@prisma/client';
import {
  DoctorDayScheduleResponseDto,
  DoctorResponseDto,
  DoctorScheduleSlotResponseDto,
} from '../dto/doctor-response.dto';

export const doctorDiscoveryInclude = {
  profileDetails: true,
  doctorSpecializations: {
    where: {
      deletedAt: null,
    },
    include: {
      specialization: {
        include: {
          specializationSymptoms: {
            where: {
              deletedAt: null,
            },
            include: {
              symptom: true,
            },
          },
        },
      },
    },
  },
  schedules: {
    where: {
      deletedAt: null,
    },
    include: {
      appointments: {
        where: {
          deletedAt: null,
          status: {
            in: [
              AppointmentStatus.PENDING,
              AppointmentStatus.CONFIRMED,
              AppointmentStatus.RESCHEDULED,
            ],
          },
        },
        take: 1,
      },
    },
    orderBy: [{ scheduleDate: 'asc' }, { startTime: 'asc' }],
  },
} satisfies Prisma.DoctorInclude;

export type DoctorDiscoveryRecord = Prisma.DoctorGetPayload<{
  include: typeof doctorDiscoveryInclude;
}>;

@Injectable()
export class DoctorResponseMapper {
  toDoctorDto(doctor: DoctorDiscoveryRecord): DoctorResponseDto {
    const specializations = doctor.doctorSpecializations
      .map((item) => item.specialization.name)
      .filter(Boolean);

    const symptoms = Array.from(
      new Set(
        doctor.doctorSpecializations.flatMap((item) => {
          const mappedSymptoms = item.specialization.specializationSymptoms
            .map((mapping) => mapping.symptom.name)
            .filter(Boolean);

          return mappedSymptoms.length > 0 ? mappedSymptoms : [item.specialization.name];
        }),
      ),
    );

    const schedule = this.toScheduleDto(doctor);
    const nextAvailableSlot = schedule
      .flatMap((day) =>
        day.slots.filter((slot) => !slot.isBooked).map((slot) => ({ date: day.date, slot })),
      )
      .find((slot) => new Date(`${slot.date}T23:59:59.999Z`) >= new Date());

    const profile = doctor.profileDetails;

    return {
      id: doctor.id,
      name: this.formatDoctorName(profile),
      specialty: specializations[0] ?? 'General Medicine',
      specializations,
      experience: `${doctor.yearsOfExperience ?? 0} yrs`,
      avatar: this.getInitials(profile.firstName, profile.lastName),
      availability: nextAvailableSlot
        ? this.formatAvailability(nextAvailableSlot.date)
        : 'No slots available',
      symptoms,
      about: doctor.bio ?? 'No biography provided yet.',
      schedule,
      reviews: [],
      fee: doctor.consultationFee ? `$${doctor.consultationFee.toString()}` : undefined,
    };
  }

  private toScheduleDto(doctor: DoctorDiscoveryRecord): DoctorDayScheduleResponseDto[] {
    const scheduleMap = new Map<string, DoctorDayScheduleResponseDto>();

    for (const slot of doctor.schedules) {
      const dateKey = slot.scheduleDate.toISOString().split('T')[0];

      if (!scheduleMap.has(dateKey)) {
        scheduleMap.set(dateKey, {
          date: dateKey,
          slots: [],
        });
      }

      if (!slot.startTime || !slot.endTime) {
        continue;
      }

      scheduleMap.get(dateKey)?.slots.push(this.toScheduleSlotDto(slot));
    }

    return Array.from(scheduleMap.values());
  }

  private toScheduleSlotDto(
    slot: DoctorDiscoveryRecord['schedules'][number],
  ): DoctorScheduleSlotResponseDto {
    return {
      id: slot.id,
      start: this.formatTime(slot.startTime as Date),
      end: this.formatTime(slot.endTime as Date),
      isBooked: slot.status !== ScheduleStatus.AVAILABLE || slot.appointments.length > 0,
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

  private formatTime(value: Date) {
    const hours = value.getUTCHours();
    const minutes = value.getUTCMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;

    return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  private formatAvailability(dateKey: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(`${dateKey}T00:00:00`);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    }

    if (date.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  private getInitials(firstName: string, lastName: string) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
