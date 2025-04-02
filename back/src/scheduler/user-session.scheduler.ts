import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../routes/user/user.service';

@Injectable()
export class UserSessionScheduler {
  constructor(private userService: UserService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    console.log('Cleaning up expired user sessions...');
    await this.userService.removeExpiredSessions();
  }
}
