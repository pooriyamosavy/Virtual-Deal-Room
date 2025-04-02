import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entities';
import { UserSession } from 'src/entities/user-session.entities';
import { Deal } from 'src/entities/deal.entities';
import { DealController } from './deal.controller';
import { DealService } from './deal.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSession, Deal])],
  controllers: [DealController],
  providers: [DealService],
  exports: [DealService],
})
export class DealModule {}
