import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { GetScheduleSlotsQueryDto } from './dto/get-schedule-slots-query.dto';
import { SaveScheduleSlotsDto } from './dto/save-schedule-slots.dto';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  private async getDoctorByUserId(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found for this user');
    }
    return doctor;
  }

  // Get specific date overrides/slots in a range
  async getSlots(userId: string, dto: GetScheduleSlotsQueryDto) {
    const doctor = await this.getDoctorByUserId(userId);
    
    const startDate = new Date(dto.startDate + 'T00:00:00.000Z');
    const endDate = new Date(dto.endDate + 'T23:59:59.999Z');

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const slots = await this.prisma.doctorSchedule.findMany({
      where: {
        doctorId: doctor.id,
        scheduleDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Format into ScheduleMap format: Record<string, DaySchedule>
    const scheduleMap: Record<string, any> = {};

    for (const slot of slots) {
      const dateKey = slot.scheduleDate.toISOString().split('T')[0];

      if (slot.startTime === null || slot.endTime === null) {
        scheduleMap[dateKey] = {
          available: false,
          timeRanges: [],
        };
        continue;
      }

      if (!scheduleMap[dateKey]) {
        scheduleMap[dateKey] = {
          available: true,
          timeRanges: [],
        };
      }

      // If already marked unavailable (e.g. by an explicit null row), skip
      if (!scheduleMap[dateKey].available) {
        continue;
      }

      const startHours = String(slot.startTime.getUTCHours()).padStart(2, '0');
      const startMinutes = String(slot.startTime.getUTCMinutes()).padStart(2, '0');
      const endHours = String(slot.endTime.getUTCHours()).padStart(2, '0');
      const endMinutes = String(slot.endTime.getUTCMinutes()).padStart(2, '0');

      scheduleMap[dateKey].timeRanges.push({
        id: slot.id,
        start: `${startHours}:${startMinutes}`,
        end: `${endHours}:${endMinutes}`,
        isUnavailable: slot.status === 'BLOCKED',
      });
    }

    return scheduleMap;
  }

  // Sync specific dates overrides/slots
  async saveSlots(userId: string, dto: SaveScheduleSlotsDto) {
    const doctor = await this.getDoctorByUserId(userId);

    // Run as transaction to guarantee consistency
    await this.prisma.$transaction(async (tx) => {
      for (const [dateKey, daySchedule] of Object.entries(dto.slots)) {
        const scheduleDate = new Date(dateKey + 'T00:00:00.000Z');
        if (isNaN(scheduleDate.getTime())) {
          throw new BadRequestException(`Invalid date key: ${dateKey}`);
        }

        if (this.isDateInPast(scheduleDate)) {
          throw new BadRequestException('Past dates cannot be saved as available schedules');
        }

        if (daySchedule.available && Array.isArray(daySchedule.timeRanges)) {
          for (const range of daySchedule.timeRanges) {
            if (this.isDateTimeInPast(scheduleDate, range.start)) {
              throw new BadRequestException('Past times cannot be saved as available schedules');
            }
          }
        }

        // 1. Clear existing slots for this doctor on this day
        await tx.doctorSchedule.deleteMany({
          where: {
            doctorId: doctor.id,
            scheduleDate,
          },
        });

        // 2. Insert new slots if the day is marked as available and has timeRanges
        if (daySchedule.available && Array.isArray(daySchedule.timeRanges)) {
          for (const range of daySchedule.timeRanges) {
            const [startH, startM] = range.start.split(':').map(Number);
            const [endH, endM] = range.end.split(':').map(Number);

            const startTime = new Date(Date.UTC(1970, 0, 1, startH, startM, 0, 0));
            const endTime = new Date(Date.UTC(1970, 0, 1, endH, endM, 0, 0));

            await tx.doctorSchedule.create({
              data: {
                doctorId: doctor.id,
                scheduleDate,
                startTime,
                endTime,
                status: range.isUnavailable ? 'BLOCKED' : 'AVAILABLE',
              },
            });
          }
        } else {
          // If the day is explicitly marked as NOT available, create a single BLOCKED record with null start/end times
          await tx.doctorSchedule.create({
            data: {
              doctorId: doctor.id,
              scheduleDate,
              startTime: null,
              endTime: null,
              status: 'BLOCKED',
            },
          });
        }
      }
    });

    return { success: true };
  }

  private isDateInPast(date: Date) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return date.getTime() < today.getTime();
  }

  private isDateTimeInPast(date: Date, time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      throw new BadRequestException(`Invalid time value: ${time}`);
    }

    const dateTime = new Date(date);
    dateTime.setUTCHours(hours, minutes, 0, 0);
    return dateTime.getTime() <= Date.now();
  }
}
