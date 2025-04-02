import {
  IsString,
  IsPhoneNumber,
  MinLength,
  IsEmail,
  IsEnum,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  password: string;

  @IsEmail()
  email: string;

  @IsEnum(['Buyer', 'Seller'], {
    message: 'role must be either Buyer or Seller',
  })
  role: 'Buyer' | 'Seller';
}
