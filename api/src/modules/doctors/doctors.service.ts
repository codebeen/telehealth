import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { GetDoctorsQueryDto } from './dto/get-doctors-query.dto';
import { DoctorResponseDto } from './dto/doctor-response.dto';
import {
  doctorDiscoveryInclude,
  DoctorResponseMapper,
} from './mappers/doctor-response.mapper';

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
}
