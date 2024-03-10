import { Injectable } from '@nestjs/common';
import { JwtService as JwtServiceM } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: JwtServiceM) {}

  async generateToken(user: User): Promise<string> {
    const payload = { id: user.id, phoneNumber: user.phoneNumber };
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }
}
