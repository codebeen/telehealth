import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class GoogleMeetLinkService {
  generate() {
    const code = [this.randomLetters(3), this.randomLetters(4), this.randomLetters(3)].join('-');
    return `https://meet.google.com/${code}`;
  }

  private randomLetters(length: number) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let value = '';

    for (let index = 0; index < length; index += 1) {
      value += alphabet[randomInt(alphabet.length)];
    }

    return value;
  }
}
