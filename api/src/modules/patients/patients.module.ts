import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../database/prisma.module';
import { PatientRepository } from './repositories/patient.repository';
import { PrismaPatientRepository } from './repositories/prisma-patient.repository';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { AllergiesController } from './allergies.controller';
import { AllergiesService } from './allergies.service';
import { MedicalHistoriesController } from './medical-histories.controller';
import { MedicalHistoriesService } from './medical-histories.service';

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
  controllers: [PatientsController, AllergiesController, MedicalHistoriesController],
  providers: [
    PatientsService,
    AllergiesService,
    MedicalHistoriesService,
    {
      provide: PatientRepository,
      useClass: PrismaPatientRepository,
    },
  ],
  exports: [PatientRepository, AllergiesService, MedicalHistoriesService],
})
export class PatientsModule {}
