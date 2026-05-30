import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AllergiesService } from './allergies.service';
import { PatientAllergyParamDto } from './dto/patient-allergy-param.dto';
import { PatientIdParamDto } from './dto/patient-id-param.dto';
import { CreateAllergyDto } from './dto/create-allergy.dto';

@Controller('patients/:patientId/allergies')
@UseGuards(JwtAuthGuard)
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) {}

  @Get()
  findAll(@Request() req, @Param() params: PatientIdParamDto) {
    return this.allergiesService.findAll(req.user.sub, params);
  }

  @Post()
  create(@Request() req, @Param() params: PatientIdParamDto, @Body() dto: CreateAllergyDto) {
    return this.allergiesService.create(req.user.sub, params, dto);
  }

  @Delete(':allergyId')
  @HttpCode(HttpStatus.OK)
  remove(@Request() req, @Param() params: PatientAllergyParamDto) {
    return this.allergiesService.remove(req.user.sub, params);
  }
}
