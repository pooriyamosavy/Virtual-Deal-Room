import { IsString } from 'class-validator';
import { User } from 'src/entities/user.entities';

export class UpdateUserDTO
  implements
    Omit<
      User,
      | 'id'
      | 'password'
      | 'phonenumberVerified'
      | 'phonenumber'
      | 'sessions'
      | 'created_at'
      | 'updated_at'
      | 'is_admin'
    >
{
  @IsString()
  fullname: string;
}
