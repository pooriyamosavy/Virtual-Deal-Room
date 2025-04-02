import { ApiProperty } from '@nestjs/swagger';

export class LoginRto {
  @ApiProperty()
  token: string;
}
