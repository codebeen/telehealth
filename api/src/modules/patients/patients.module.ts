import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { PatientRepository } from './repositories/patient.repository';
import { PrismaPatientRepository } from './repositories/prisma-patient.repository';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PatientsController],
  providers: [
    PatientsService,
    {
      provide: PatientRepository,
      useClass: PrismaPatientRepository,
    },
  ],
  exports: [PatientRepository],
})
export class PatientsModule {}
