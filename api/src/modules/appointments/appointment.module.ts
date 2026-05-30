import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../database/prisma.module';
import { AppointmentController } from './appointment.controller';
import { AppointmentResponseMapper } from './mappers/appointment-response.mapper';
import { GoogleMeetLinkService } from './services/google-meet-link.service';
import { AppointmentService } from './appointment.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    NotificationsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallbackSecret',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any,
      },
    }),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentResponseMapper, GoogleMeetLinkService],
})
export class AppointmentModule {}
