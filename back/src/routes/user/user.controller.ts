import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entities';
import { AuthUser } from 'src/decorator/auth-user.decorator';
import { UserByIdPipe } from 'src/pipes/user-by-id.pipe';
import { UpdateUserDTO } from './dto/update-user.dto';
import { PaginationRto } from 'src/@types/pagination';
import { ERole, Role } from 'src/decorator/Role.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async user(@AuthUser() user: User): Promise<User> {
    return user;
  }

  @Get('all')
  async getAllUsers(
    @Query('fullname') fullname?: string,
    @Query('phonenumber') phonenumber?: string,
    @Query('phonenumberVerified') phonenumberVerified?: boolean,
    @Query('page') page?: number,
    @Query('pagesize') pagesize?: number,
  ): Promise<PaginationRto> {
    return this.userService.getUsers(
      {
        fullname,
        phonenumber,
        phonenumberVerified,
      },
      { page, pagesize },
    );
  }

  @Get(':id')
  @Role(ERole.admin)
  async userById(@Param('id', UserByIdPipe) user: User): Promise<User> {
    return user;
  }

  @Put('')
  async UpdateUser(
    @Body() body: UpdateUserDTO,
    @AuthUser() user: User,
  ): Promise<User> {
    return this.userService.updateUser({
      ...user,
      ...body,
    });
  }

  @Put(':id')
  @Role(ERole.admin)
  async UpdateAUser(
    @Body() body: UpdateUserDTO,
    @Param('id', UserByIdPipe) user: User,
  ): Promise<User> {
    return this.userService.updateUser({
      ...user,
      ...body,
    });
  }

  @Delete(':id')
  @Role(ERole.admin)
  async deleteUser(@Param('id', UserByIdPipe) user: User) {
    return this.userService.deleteUser(user);
  }
}
