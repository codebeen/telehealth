import { Injectable } from '@nestjs/common';
import { DoctorRepository } from './repositories/doctor.repository';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(
    private readonly doctorRepository: DoctorRepository,
    private readonly prisma: PrismaService,
  ) {}

  async getSpecializations() {
    return this.prisma.specialization.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
