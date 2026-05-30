import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { PatientIdParamDto } from './dto/patient-id-param.dto';
import { PatientMedicalHistoryParamDto } from './dto/patient-medical-history-param.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { MedicalHistoriesService } from './medical-histories.service';

@Controller('patients/:patientId/medical-histories')
@UseGuards(JwtAuthGuard)
export class MedicalHistoriesController {
  constructor(private readonly medicalHistoriesService: MedicalHistoriesService) {}

  @Get()
  findAll(@Request() req, @Param() params: PatientIdParamDto) {
    return this.medicalHistoriesService.findAll(req.user.sub, params);
  }

  @Post()
  create(
    @Request() req,
    @Param() params: PatientIdParamDto,
    @Body() dto: CreateMedicalHistoryDto,
  ) {
    return this.medicalHistoriesService.create(req.user.sub, params, dto);
  }

  @Patch(':medicalHistoryId')
  update(
    @Request() req,
    @Param() params: PatientMedicalHistoryParamDto,
    @Body() dto: UpdateMedicalHistoryDto,
  ) {
    return this.medicalHistoriesService.update(req.user.sub, params, dto);
  }

  @Delete(':medicalHistoryId')
  @HttpCode(HttpStatus.OK)
  remove(@Request() req, @Param() params: PatientMedicalHistoryParamDto) {
    return this.medicalHistoriesService.remove(req.user.sub, params);
  }
}
