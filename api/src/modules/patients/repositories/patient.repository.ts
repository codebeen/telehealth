import { Patient, Prisma } from '@prisma/client';

export abstract class PatientRepository {
  abstract create(data: Prisma.PatientCreateInput, tx?: Prisma.TransactionClient): Promise<Patient>;
}
