import { Controller, Get, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { GetDoctorsQueryDto } from './dto/get-doctors-query.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  async getDoctors(@Query() query: GetDoctorsQueryDto) {
    return this.doctorsService.getDoctorsWithSchedules(query);
  }

  @Get('specializations')
  async getSpecializations() {
    return this.doctorsService.getSpecializations();
  }
}
