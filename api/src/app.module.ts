import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    PatientsModule,
    DoctorsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
