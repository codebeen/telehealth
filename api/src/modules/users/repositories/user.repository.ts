import { User, Prisma } from '@prisma/client';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(data: Prisma.UserCreateInput, tx?: Prisma.TransactionClient): Promise<User>;
}
