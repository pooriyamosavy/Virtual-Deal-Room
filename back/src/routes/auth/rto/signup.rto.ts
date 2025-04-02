import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entities';

export class SignupRto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: User;
}
