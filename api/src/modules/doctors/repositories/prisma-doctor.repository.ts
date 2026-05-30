import { Injectable } from '@nestjs/common';
import { Doctor, Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { DoctorRepository } from './doctor.repository';

@Injectable()
export class PrismaDoctorRepository implements DoctorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByLicenseNumber(licenseNumber: string): Promise<Doctor | null> {
    return this.prisma.doctor.findUnique({
      where: {
        licenseNumber,
      },
    });
  }

  async create(data: Prisma.DoctorCreateInput, tx?: Prisma.TransactionClient): Promise<Doctor> {
    const db = tx || this.prisma;
    return db.doctor.create({
      data,
    });
  }
}
