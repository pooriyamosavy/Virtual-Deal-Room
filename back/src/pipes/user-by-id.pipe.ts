import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { User } from '../entities/user.entities';
import { UserCrudService } from '../services/crud/user-crud.service';

@Injectable()
export class UserByIdPipe implements PipeTransform<string, Promise<User>> {
  constructor(private userCrudService: UserCrudService) {}

  async transform(value: string): Promise<User> {
    const userId = parseInt(value, 10);

    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userCrudService.getUser({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
