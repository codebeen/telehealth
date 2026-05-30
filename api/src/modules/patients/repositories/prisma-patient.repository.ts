import { Injectable } from '@nestjs/common';
import { Patient, Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { PatientRepository } from './patient.repository';

@Injectable()
export class PrismaPatientRepository implements PatientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PatientCreateInput, tx?: Prisma.TransactionClient): Promise<Patient> {
    const db = tx || this.prisma;
    return db.patient.create({
      data,
    });
  }
}
