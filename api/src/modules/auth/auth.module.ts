import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../database/prisma.module';
import { UsersModule } from '../users/users.module';
import { PatientsModule } from '../patients/patients.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IEncryptionService } from './interfaces/encryption.service.interface';
import { BcryptEncryptionService } from './services/bcrypt-encryption.service';
import 'dotenv/config';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    PatientsModule,
    DoctorsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallbackSecret',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: IEncryptionService,
      useClass: BcryptEncryptionService,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
