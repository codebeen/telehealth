import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IEncryptionService } from '../interfaces/encryption.service.interface';

@Injectable()
export class BcryptEncryptionService implements IEncryptionService {
  private readonly saltRounds = 10;

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, this.saltRounds);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
