import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/@types/token';
import { UserSession } from 'src/entities/user-session.entities';
import { User } from 'src/entities/user.entities';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async createToken(user: User, userSession: UserSession): Promise<string> {
    const payload: Token = { userId: user.id, userSessionid: userSession.id };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify<Token>(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (e) {
      throw new Error('Invalid or expired token');
    }
  }
}
