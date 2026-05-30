import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../database/prisma.module';
import { DoctorRepository } from './repositories/doctor.repository';
import { PrismaDoctorRepository } from './repositories/prisma-doctor.repository';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DoctorResponseMapper } from './mappers/doctor-response.mapper';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallbackSecret',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any,
      },
    }),
  ],
  controllers: [DoctorsController],
  providers: [
    DoctorsService,
    DoctorResponseMapper,
    {
      provide: DoctorRepository,
      useClass: PrismaDoctorRepository,
    },
  ],
  exports: [DoctorRepository],
})
export class DoctorsModule {}
