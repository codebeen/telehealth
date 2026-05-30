import { Controller, Get, Post, Body, Query, UseGuards, Request, HttpStatus, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ScheduleService } from './schedule.service';
import { GetScheduleSlotsQueryDto } from './dto/get-schedule-slots-query.dto';
import { SaveScheduleSlotsDto } from './dto/save-schedule-slots.dto';

@Controller('consultation/schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('slots')
  async getSlots(
    @Request() req,
    @Query() query: GetScheduleSlotsQueryDto,
  ) {
    const userId = req.user.sub;
    return this.scheduleService.getSlots(userId, query);
  }

  @Post('slots')
  @HttpCode(HttpStatus.OK)
  async saveSlots(@Request() req, @Body() dto: SaveScheduleSlotsDto) {
    const userId = req.user.sub;
    return this.scheduleService.saveSlots(userId, dto);
  }
}
