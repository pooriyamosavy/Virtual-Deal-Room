import { IsString } from 'class-validator';
import { User } from 'src/entities/user.entities';

export class UpdateUserDTO
  implements
    Omit<
      User,
      | 'id'
      | 'password'
      | 'sessions'
      | 'created_at'
      | 'updated_at'
      | 'role'
      | 'email'
    >
{
  @IsString()
  fullname: string;
}
