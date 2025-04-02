import { IsString, IsPhoneNumber, MinLength } from 'class-validator';

export class SignupDto {
  @IsPhoneNumber('IR', { message: 'Invalid phone number' })
  phonenumber: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
