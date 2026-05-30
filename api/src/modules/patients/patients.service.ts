import { Injectable } from '@nestjs/common';
import { PatientRepository } from './repositories/patient.repository';

@Injectable()
export class PatientsService {
  constructor(private readonly patientRepository: PatientRepository) {}
}
