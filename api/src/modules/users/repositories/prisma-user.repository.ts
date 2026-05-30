import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { UserRepository } from './user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(data: Prisma.UserCreateInput, tx?: Prisma.TransactionClient): Promise<User> {
    const db = tx || this.prisma;
    return db.user.create({
      data,
    });
  }
}
