import { Doctor, Prisma } from '@prisma/client';

export abstract class DoctorRepository {
  abstract findByLicenseNumber(licenseNumber: string): Promise<Doctor | null>;
  abstract create(data: Prisma.DoctorCreateInput, tx?: Prisma.TransactionClient): Promise<Doctor>;
}
