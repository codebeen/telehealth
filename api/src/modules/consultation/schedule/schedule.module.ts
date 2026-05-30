import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../database/prisma.module';
import { AuthModule } from '../../auth/auth.module';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
