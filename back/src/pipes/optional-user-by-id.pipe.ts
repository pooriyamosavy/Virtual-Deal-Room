import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { User } from '../entities/user.entities';
import { UserCrudService } from '../services/crud/user-crud.service';

@Injectable()
export class OptionalUserByIdPipe
  implements PipeTransform<string, Promise<User>>
{
  constructor(private userCrudService: UserCrudService) {}

  async transform(value: any): Promise<User> {
    console.log({ value });
    if (value === undefined || value === null || value instanceof User) {
      return value;
    }
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
