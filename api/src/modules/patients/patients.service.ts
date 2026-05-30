import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PatientRepository } from './repositories/patient.repository';

@Injectable()
export class PatientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly patientRepository: PatientRepository,
  ) {}

  async getPatientProfile(userId: string, patientId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
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
        medicalHistories: {
          where: { deletedAt: null },
          orderBy: { diagnosedDate: 'desc' },
        },
        allergies: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!patient) {
      throw new ForbiddenException('You can only access your own profile details');
    }

    return patient;
  }

  async updatePatientProfile(userId: string, patientId: string, dto: any) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
        userId,
        deletedAt: null,
      },
      include: {
        profileDetails: true,
      },
    });

    if (!patient) {
      throw new ForbiddenException('You can only update your own profile details');
    }

    // Update ProfileDetails
    await this.prisma.profileDetails.update({
      where: { id: patient.profileDetailsId },
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

    // Update Patient properties
    await this.prisma.patient.update({
      where: { id: patientId },
      data: {
        weight: dto.weight !== undefined ? Number(dto.weight) : undefined,
        height: dto.height !== undefined ? Number(dto.height) : undefined,
        bloodType: dto.bloodType,
        emergencyContactName: dto.emergencyContactName,
        emergencyContactNumber: dto.emergencyContactNumber,
      },
    });

    return this.getPatientProfile(userId, patientId);
  }
}
