import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { PatientAllergyParamDto } from './dto/patient-allergy-param.dto';
import { PatientIdParamDto } from './dto/patient-id-param.dto';
import { UpdateAllergyDto } from './dto/update-allergy.dto';

@Injectable()
export class AllergiesService {
  constructor(private readonly prisma: PrismaService) {}

  private async getAuthorizedPatient(userId: string, patientId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
        userId,
        deletedAt: null,
      },
    });
    if (!patient) {
      throw new NotFoundException('Patient profile not found for this user');
    }
    return patient;
  }

  async findAll(userId: string, params: PatientIdParamDto) {
    const patient = await this.getAuthorizedPatient(userId, params.patientId);

    const allergies = await this.prisma.patientAllergy.findMany({
      where: {
        patientId: patient.id,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
    });

    return allergies.map((allergy) => ({
      id: allergy.id,
      name: allergy.name,
      createdAt: allergy.createdAt,
    }));
  }

  async create(userId: string, params: PatientIdParamDto, dto: CreateAllergyDto) {
    const patient = await this.getAuthorizedPatient(userId, params.patientId);
    const trimmedName = dto.name.trim();
    if (!trimmedName) {
      throw new ConflictException('Allergy name cannot be empty');
    }

    const existing = await this.prisma.patientAllergy.findFirst({
      where: {
        patientId: patient.id,
        deletedAt: null,
        name: { equals: trimmedName, mode: 'insensitive' },
      },
    });
    if (existing) {
      throw new ConflictException('Allergy already listed');
    }

    const allergy = await this.prisma.patientAllergy.create({
      data: {
        patientId: patient.id,
        name: trimmedName,
      },
    });

    return {
      id: allergy.id,
      name: allergy.name,
      createdAt: allergy.createdAt,
    };
  }

  async update(userId: string, params: PatientAllergyParamDto, dto: UpdateAllergyDto) {
    const patient = await this.getAuthorizedPatient(userId, params.patientId);
    const trimmedName = dto.name.trim();
    if (!trimmedName) {
      throw new ConflictException('Allergy name cannot be empty');
    }

    const allergy = await this.prisma.patientAllergy.findFirst({
      where: {
        id: params.allergyId,
        patientId: patient.id,
        deletedAt: null,
      },
    });
    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    const duplicate = await this.prisma.patientAllergy.findFirst({
      where: {
        patientId: patient.id,
        deletedAt: null,
        name: { equals: trimmedName, mode: 'insensitive' },
        id: { not: params.allergyId },
      },
    });
    if (duplicate) {
      throw new ConflictException('Allergy already listed');
    }

    const updated = await this.prisma.patientAllergy.update({
      where: { id: params.allergyId },
      data: { name: trimmedName },
    });

    return {
      id: updated.id,
      name: updated.name,
      createdAt: updated.createdAt,
    };
  }

  async createManyForPatient(
    patientId: string,
    names: string[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    const uniqueNames = [
      ...new Set(names.map((name) => name.trim()).filter(Boolean)),
    ];

    if (uniqueNames.length === 0) return;

    await client.patientAllergy.createMany({
      data: uniqueNames.map((name) => ({
        patientId,
        name,
      })),
    });
  }

  async remove(userId: string, params: PatientAllergyParamDto) {
    const patient = await this.getAuthorizedPatient(userId, params.patientId);

    const allergy = await this.prisma.patientAllergy.findFirst({
      where: {
        id: params.allergyId,
        patientId: patient.id,
        deletedAt: null,
      },
    });
    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    await this.prisma.patientAllergy.update({
      where: { id: params.allergyId },
      data: { deletedAt: new Date() },
    });

    return { success: true };
  }
}
