import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entities';
import { UserSession } from 'src/entities/user-session.entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSession])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
