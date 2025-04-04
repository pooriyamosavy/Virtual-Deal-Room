import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entities';
import { FindOptionsWhere, Repository } from 'typeorm';
import { RedisService } from '../redis.service';
import { PaginationQuery } from 'src/@types/pagination';
import { ArrayUser } from './entityConstructors/user';
import { UserSession } from 'src/entities/user-session.entities';

@Injectable()
export class UserCrudService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserSession)
    private userSessionRepo: Repository<UserSession>,
    private readonly redisService: RedisService,
  ) {}

  async getUser(userWhere: FindOptionsWhere<User>) {
    return await this.redisService.getCallback<User>(
      'user',
      userWhere,
      async () => {
        return await this.userRepo.findOne({ where: userWhere });
      },
      User,
    );
  }

  async getUsers(
    userWhere: FindOptionsWhere<User>,
    pagination: PaginationQuery,
  ) {
    return this.redisService.getCallback<User[]>(
      'users',
      {
        ...userWhere,
        page: pagination.page || 1,
        pagesize: pagination.pagesize || 10,
      },
      async () => {
        return await this.userRepo.find({
          where: userWhere,
          skip: ((pagination.page || 1) - 1) * (pagination.pagesize || 10),
          take: pagination.pagesize || 10,
        });
      },
      ArrayUser,
    );
  }

  async getUsersCount(userWhere: FindOptionsWhere<User>) {
    return this.redisService.getCallback<number>(
      'users-count',
      userWhere,
      async () => {
        return await this.userRepo.count({ where: userWhere });
      },
    );
  }

  async updateUser(user: User) {
    return this.redisService.updateCallback<User>(
      'user',
      { id: user.id },
      async () => this.userRepo.update(user.id, user),
      user,
    );
  }

  async deleteUser(user: User) {
    return this.redisService.deleteCallback<User>(
      'user',
      { id: user.id },
      async () => {
        await this.userSessionRepo.delete({
          user_id: user.id,
        } as FindOptionsWhere<UserSession>);
        await this.userRepo.remove(user);
      },
    );
  }

  async createUser(user: User) {
    return this.redisService.createCallback<User>(
      'user',
      { id: user.id },
      async () => this.userRepo.save(user),
    );
  }
}
