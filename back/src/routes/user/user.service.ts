import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationRto, PaginationQuery } from 'src/@types/pagination';
import { PartialExceptSome } from 'src/@types/PartialSome';
import { UserSession } from 'src/entities/user-session.entities';
import { User } from 'src/entities/user.entities';
import { UserCrudService } from 'src/services/crud/user-crud.service';
import { ILike, LessThan, Repository } from 'typeorm';
import { deleteUserSuccessMessage } from './static/response.text';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserSession)
    private userSessionRepository: Repository<UserSession>,
    private userCrudService: UserCrudService,
  ) {}

  // user
  async getUser(user: Partial<User>) {
    return this.userCrudService.getUser(user);
  }

  async getUsers(
    user: Omit<Partial<User>, 'id' | 'password'>,
    pagination: PaginationQuery,
  ): Promise<PaginationRto> {
    const where = {
      fullname: user.fullname ? ILike(`%${user.fullname}%`) : undefined,
      email: user.email ? ILike(`%${user.email}%`) : undefined,
      phonenumberVerified: user.email,
    };

    const result = await this.userCrudService.getUsers(where, pagination);

    const total = await this.userCrudService.getUsersCount(where);

    const response = new PaginationRto({
      data: result,
      page: pagination.page,
      pagesize: pagination.pagesize,
      total,
    });

    return response;
  }

  async updateUser(user: PartialExceptSome<User, 'id'>): Promise<User> {
    await this.userCrudService.updateUser(user);

    return new User(user);
  }

  async deleteUser(user: User) {
    await this.userCrudService.deleteUser(user);
    return deleteUserSuccessMessage;
  }

  // session
  async getUserSessionById(id: number) {
    return this.userSessionRepository.findOne({
      where: {
        id,
      },
    });
  }

  async removeExpiredSessions(): Promise<void> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    await this.userSessionRepository.delete({
      used_at: LessThan(oneWeekAgo),
    });
  }
}
