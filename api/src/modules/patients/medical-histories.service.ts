import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { MedicalHistoryStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { PatientIdParamDto } from './dto/patient-id-param.dto';
import { PatientMedicalHistoryParamDto } from './dto/patient-medical-history-param.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';

@Injectable()
export class MedicalHistoriesService {
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

  private mapHistory(history: {
    id: string;
    conditionName: string;
    diagnosedDate: Date | null;
    status: MedicalHistoryStatus;
    description: string | null;
  }) {
    return {
      id: history.id,
      conditionName: history.conditionName,
      diagnosedDate: history.diagnosedDate?.toISOString().split('T')[0] ?? '',
      status: history.status,
      description: history.description ?? '',
    };
  }

  async findAll(userId: string, params: PatientIdParamDto) {
    const patient = await this.getAuthorizedPatient(userId, params.patientId);
    const histories = await this.prisma.patientMedicalHistory.findMany({
      where: {
        patientId: patient.id,
        deletedAt: null,
      },
      orderBy: [{ diagnosedDate: 'desc' }, { createdAt: 'desc' }],
    });

    return histories.map((history) => this.mapHistory(history));
  }

  async create(userId: string, params: PatientIdParamDto, dto: CreateMedicalHistoryDto) {
    const patient = await this.getAuthorizedPatient(userId, params.patientId);
    const conditionName = dto.conditionName.trim();
    if (!conditionName) {
      throw new ConflictException('Condition name cannot be empty');
    }

    const history = await this.prisma.patientMedicalHistory.create({
      data: {
        patientId: patient.id,
        conditionName,
        diagnosedDate: dto.diagnosedDate ? new Date(dto.diagnosedDate) : null,
        status: dto.status ?? MedicalHistoryStatus.ACTIVE,
        description: dto.description?.trim() || null,
      },
    });

    return this.mapHistory(history);
  }

  async update(
    userId: string,
    params: PatientMedicalHistoryParamDto,
    dto: UpdateMedicalHistoryDto,
  ) {
    const patient = await this.getAuthorizedPatient(userId, params.patientId);
    const existing = await this.prisma.patientMedicalHistory.findFirst({
      where: {
        id: params.medicalHistoryId,
        patientId: patient.id,
        deletedAt: null,
      },
    });
    if (!existing) {
      throw new NotFoundException('Medical history entry not found');
    }

    const conditionName = dto.conditionName?.trim();
    if (dto.conditionName !== undefined && !conditionName) {
      throw new ConflictException('Condition name cannot be empty');
    }

    const history = await this.prisma.patientMedicalHistory.update({
      where: { id: params.medicalHistoryId },
      data: {
        conditionName,
        diagnosedDate:
          dto.diagnosedDate !== undefined
            ? dto.diagnosedDate
              ? new Date(dto.diagnosedDate)
              : null
            : undefined,
        status: dto.status,
        description:
          dto.description !== undefined ? dto.description.trim() || null : undefined,
      },
    });

    return this.mapHistory(history);
  }

  async remove(userId: string, params: PatientMedicalHistoryParamDto) {
    const patient = await this.getAuthorizedPatient(userId, params.patientId);
    const existing = await this.prisma.patientMedicalHistory.findFirst({
      where: {
        id: params.medicalHistoryId,
        patientId: patient.id,
        deletedAt: null,
      },
    });
    if (!existing) {
      throw new NotFoundException('Medical history entry not found');
    }

    await this.prisma.patientMedicalHistory.update({
      where: { id: params.medicalHistoryId },
      data: { deletedAt: new Date() },
    });

    return { success: true };
  }
}
