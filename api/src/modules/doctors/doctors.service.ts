import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { GetDoctorsQueryDto } from './dto/get-doctors-query.dto';
import { DoctorResponseDto } from './dto/doctor-response.dto';
import {
  doctorDiscoveryInclude,
  DoctorResponseMapper,
} from './mappers/doctor-response.mapper';
import { UpdatePatientConsultationRecordDto } from './dto/update-patient-consultation-record.dto';

export interface CompletedConsultationSessionDto {
  id: string;
  date: string;
  type: string;
  findings: string;
  recommendations: string;
  prescriptions: string;
  summary: string;
}

export interface CompletedPatientRecordDto {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  phone: string;
  status: 'Completed';
  history: CompletedConsultationSessionDto[];
  medicalHistory: {
    id: string;
    conditionName: string;
    diagnosedDate: string;
    status: string;
    description: string;
  }[];
  allergies: {
    id: string;
    name: string;
    createdAt: string;
  }[];
}

@Injectable()
export class DoctorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly doctorResponseMapper: DoctorResponseMapper,
  ) {}

  async getSpecializations() {
    return this.prisma.specialization.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getDoctorsWithSchedules(dto: GetDoctorsQueryDto): Promise<DoctorResponseDto[]> {
    const doctors = await this.prisma.doctor.findMany({
      where: {
        deletedAt: null,
        user: {
          deletedAt: null,
        },
        ...(dto.search
          ? {
              profileDetails: {
                OR: [
                  { firstName: { contains: dto.search, mode: 'insensitive' } },
                  { middleName: { contains: dto.search, mode: 'insensitive' } },
                  { lastName: { contains: dto.search, mode: 'insensitive' } },
                ],
              },
            }
          : {}),
        ...(dto.specialization
          ? {
              doctorSpecializations: {
                some: {
                  deletedAt: null,
                  specialization: {
                    name: { equals: dto.specialization, mode: 'insensitive' },
                    deletedAt: null,
                  },
                },
              },
            }
          : {}),
      },
      include: doctorDiscoveryInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return doctors.map((doctor) => this.doctorResponseMapper.toDoctorDto(doctor));
  }

  async getCompletedConsultationPatients(userId: string, doctorId: string) {
    await this.getAuthorizedDoctor(userId, doctorId);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        status: AppointmentStatus.COMPLETED,
        deletedAt: null,
      },
      include: {
        patient: {
          include: {
            user: true,
            profileDetails: true,
            medicalHistories: {
              where: { deletedAt: null },
              orderBy: { diagnosedDate: 'desc' },
            },
            allergies: {
              where: { deletedAt: null },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        medicalRecord: true,
      },
      orderBy: [{ appointmentDate: 'desc' }, { startTime: 'desc' }],
    });

    const patientMap = new Map<string, CompletedPatientRecordDto>();

    for (const appointment of appointments) {
      const existing = patientMap.get(appointment.patientId);
      const patientRecord = existing ?? this.createPatientRecord(appointment);
      patientRecord.history.push({
        id: appointment.medicalRecord?.id ?? appointment.id,
        date: this.formatDisplayDate(appointment.appointmentDate),
        type:
          appointment.medicalRecord?.consultationType ??
          appointment.consultationType ??
          'Consultation',
        findings:
          appointment.medicalRecord?.clinicalFindings ??
          appointment.medicalRecord?.diagnosis ??
          'No clinical findings recorded.',
        recommendations:
          appointment.medicalRecord?.recommendations ??
          appointment.medicalRecord?.consultationNotes ??
          'No recommendations recorded.',
        prescriptions: appointment.medicalRecord?.medicationSummary ?? '',
        summary: appointment.medicalRecord?.finalSummary ?? '',
      });
      patientMap.set(appointment.patientId, patientRecord);
    }

    return Array.from(patientMap.values());
  }

  async updatePatientConsultationRecord(
    userId: string,
    doctorId: string,
    patientId: string,
    recordId: string,
    dto: UpdatePatientConsultationRecordDto,
  ): Promise<CompletedConsultationSessionDto> {
    await this.getAuthorizedDoctor(userId, doctorId);

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

    const existingRecord = await this.prisma.medicalRecord.findFirst({
      where: {
        id: recordId,
        doctorId,
        patientId,
        deletedAt: null,
        appointment: {
          status: AppointmentStatus.COMPLETED,
          deletedAt: null,
        },
      },
      include: {
        appointment: true,
      },
    });

    if (!existingRecord) {
      throw new NotFoundException('Consultation record not found');
    }

    const updatedRecord = await this.prisma.medicalRecord.update({
      where: { id: existingRecord.id },
      data: {
        consultationType,
        clinicalFindings,
        recommendations,
        medicationSummary: medicationPrescriptions || null,
        finalSummary: finalSummary || null,
        diagnosis: clinicalFindings,
        consultationNotes: recommendations,
      },
      include: {
        appointment: true,
      },
    });

    return {
      id: updatedRecord.id,
      date: this.formatDisplayDate(updatedRecord.appointment.appointmentDate),
      type: updatedRecord.consultationType ?? 'Consultation',
      findings: updatedRecord.clinicalFindings ?? updatedRecord.diagnosis,
      recommendations:
        updatedRecord.recommendations ??
        updatedRecord.consultationNotes ??
        'No recommendations recorded.',
      prescriptions: updatedRecord.medicationSummary ?? '',
      summary: updatedRecord.finalSummary ?? '',
    };
  }

  async getDoctorDashboard(userId: string, doctorId: string) {
    await this.getAuthorizedDoctor(userId, doctorId);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    // 1. Total consultations (COMPLETED appointments)
    const totalConsultations = await this.prisma.appointment.count({
      where: {
        doctorId,
        status: AppointmentStatus.COMPLETED,
        deletedAt: null,
      },
    });

    // 2. Scheduled today (PENDING or CONFIRMED appointments for today)
    const scheduledToday = await this.prisma.appointment.count({
      where: {
        doctorId,
        appointmentDate: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
        deletedAt: null,
      },
    });

    // 3. Active patients (Distinct patientIds with appointments)
    const activePatientsCount = await this.prisma.appointment.groupBy({
      by: ['patientId'],
      where: {
        doctorId,
        deletedAt: null,
      },
    }).then((res) => res.length);

    // 4. Prescriptions sent (Completed medical records with medication summary)
    const prescriptionsCount = await this.prisma.medicalRecord.count({
      where: {
        doctorId,
        medicationSummary: {
          not: null,
        },
        deletedAt: null,
      },
    });

    // 5. Today's appointments list
    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: {
          gte: today,
          lt: tomorrow,
        },
        deletedAt: null,
      },
      include: {
        patient: {
          include: {
            profileDetails: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // 6. Recent patients list (Recent completed consultation patients)
    const completedPatients = await this.getCompletedConsultationPatients(userId, doctorId);

    return {
      stats: {
        totalConsultations,
        scheduledToday,
        activePatientsCount,
        prescriptionsCount,
      },
      appointments: appointments.map((appt) => {
        const profile = appt.patient.profileDetails;
        const patientName = [profile.firstName, profile.middleName, profile.lastName]
          .filter(Boolean)
          .join(' ');
        const initials = [profile.firstName[0], profile.lastName[0]].filter(Boolean).join('');
        
        const timeStr = appt.startTime ? new Date(appt.startTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: 'UTC'
        }) : '';

        return {
          id: appt.id,
          patient: patientName,
          time: timeStr,
          type: appt.consultationType || 'Virtual Consultation',
          status: appt.status,
          avatar: initials,
          patientId: appt.patientId,
        };
      }),
      recentPatients: completedPatients.slice(0, 5).map((p) => {
        const lastSession = p.history[0];
        return {
          id: p.id,
          name: p.name,
          condition: lastSession ? lastSession.type : 'Consultation',
          lastVisit: lastSession ? lastSession.date : '—',
          status: p.status,
        };
      }),
    };
  }

  async getDoctorProfile(userId: string, doctorId: string) {
    const doctor = await this.prisma.doctor.findFirst({
      where: {
        id: doctorId,
        userId,
        deletedAt: null,
      },
      include: {
        user: true,
        profileDetails: {
          include: {
            address: true,
          },
        },
        doctorSpecializations: {
          where: { deletedAt: null },
          include: {
            specialization: true,
          },
        },
      },
    });

    if (!doctor) {
      throw new ForbiddenException('You can only access your own doctor profile');
    }

    const { yearsOfExperience, consultationFee, ...rest } = doctor;
    return rest;
  }

  async updateDoctorProfile(userId: string, doctorId: string, dto: any) {
    const doctor = await this.prisma.doctor.findFirst({
      where: {
        id: doctorId,
        userId,
        deletedAt: null,
      },
      include: {
        profileDetails: true,
      },
    });

    if (!doctor) {
      throw new ForbiddenException('You can only update your own doctor profile');
    }

    // Update ProfileDetails
    await this.prisma.profileDetails.update({
      where: { id: doctor.profileDetailsId },
      data: {
        firstName: dto.firstName,
        middleName: dto.middleName,
        lastName: dto.lastName,
        suffix: dto.suffix,
        gender: dto.gender,
        phoneNumber: dto.phoneNumber,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        profilePicture: dto.profilePicture !== undefined ? dto.profilePicture : undefined,
        address: dto.address ? {
          update: {
            streetLine1: dto.address.streetLine1 || dto.address.street || '',
            city: dto.address.city || '',
            province: dto.address.province || dto.address.state || '',
            zipCode: dto.address.zipCode || dto.address.postalCode || '',
            country: dto.address.country || 'Philippines',
          }
        } : undefined,
      },
    });

    // Update Doctor properties
    await this.prisma.doctor.update({
      where: { id: doctorId },
      data: {
        bio: dto.bio,
      },
    });

    return this.getDoctorProfile(userId, doctorId);
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
      throw new ForbiddenException('You can only access your own patient directory');
    }

    return doctor;
  }

  private createPatientRecord(appointment: any): CompletedPatientRecordDto {
    const profile = appointment.patient.profileDetails;

    return {
      id: appointment.patientId,
      name: [profile.firstName, profile.middleName, profile.lastName, profile.suffix]
        .filter(Boolean)
        .join(' '),
      age: this.calculateAge(profile.birthDate),
      gender: profile.gender,
      contact: appointment.patient.user.email,
      phone: profile.phoneNumber,
      status: 'Completed' as const,
      history: [],
      medicalHistory: appointment.patient.medicalHistories.map((history) => ({
        id: history.id,
        conditionName: history.conditionName,
        diagnosedDate: history.diagnosedDate
          ? history.diagnosedDate.toISOString().split('T')[0]
          : '',
        status: history.status,
        description: history.description ?? '',
      })),
      allergies: appointment.patient.allergies.map((allergy) => ({
        id: allergy.id,
        name: allergy.name,
        createdAt: allergy.createdAt.toISOString(),
      })),
    };
  }

  private calculateAge(value: Date) {
    const today = new Date();
    let age = today.getUTCFullYear() - value.getUTCFullYear();
    const monthDiff = today.getUTCMonth() - value.getUTCMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < value.getUTCDate())) {
      age -= 1;
    }

    return age;
  }

  private formatDisplayDate(value: Date) {
    return value.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }
}
