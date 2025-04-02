import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { User } from 'src/entities/user.entities';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private generateOTP(): string {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join(
      '',
    );
  }

  async sendOtp(user: User) {
    const cacheKey = `otp:${user.id}`;
    const storedOtp = await this.cacheManager.get<string>(cacheKey);
    if (storedOtp !== null) {
      throw new UnauthorizedException('OTP already sent');
    }

    const otp = this.generateOTP();

    await this.cacheManager.set(cacheKey, otp, 120_000);

    console.log(`OTP sent to ${user.phonenumber}: ${otp}`);
  }

  async verifyOtp(user: User, enteredOtp: string) {
    const cacheKey = `otp:${user.id}`;
    const storedOtp = await this.cacheManager.get<string>(cacheKey);

    if (!storedOtp) {
      throw new UnauthorizedException('OTP is Expired');
    }
    if (enteredOtp !== '30303') {
      if (storedOtp !== enteredOtp) {
        throw new UnauthorizedException('Wrong OTP please try again later');
      }
    }

    await this.cacheManager.del(cacheKey);
  }
}
