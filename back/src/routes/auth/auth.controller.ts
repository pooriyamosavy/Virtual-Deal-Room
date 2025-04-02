import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/entities/user.entities';
import { AuthUser } from 'src/decorator/auth-user.decorator';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SignupRto } from './rto/signup.rto';
import { ApiResponse } from '@nestjs/swagger';
import {
  logoutSuccessMessage,
  sendOtpSuccessMessage,
  verifyOtpSuccessMessage,
} from './static/response.text';
import { ERole, Role } from 'src/decorator/Role.decorator';
import { AuthUserSession } from 'src/decorator/auth-session.decorator';
import { UserSession } from 'src/entities/user-session.entities';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Role(ERole.public)
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  @Role(ERole.public)
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @ApiResponse({ status: 201, description: logoutSuccessMessage })
  @Post('logout')
  logout(@AuthUserSession() userSession: UserSession) {
    return this.authService.logout(userSession);
  }

  @ApiResponse({})
  @Post('change-password')
  changePassword(@AuthUser() user: User, @Body() body: ChangePasswordDto) {
    return this.authService.changePassword(user, body);
  }
}
