import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entities';
import { Repository, FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/services/token.service';
import { LoginDto } from './dto/login.dto';
import { SignupRto } from './rto/signup.rto';
import { LoginRto } from './rto/login.rto';
import { logoutSuccessMessage } from './static/response.text';
import { UserSession } from 'src/entities/user-session.entities';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { UserCrudService } from 'src/services/crud/user-crud.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserSession)
    private userSessionRepository: Repository<UserSession>,
    private tokenService: TokenService,
    private userCrudService: UserCrudService,
  ) {}

  async signup(body: SignupDto): Promise<SignupRto> {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = new User({
      fullname: '',
      password: hashedPassword,
      email: body.email,
      role: body.role,
    });

    const newUser = await this.userCrudService.createUser(user);

    const userSession = new UserSession({
      user_id: newUser,
    });

    const newUserSession = await this.userSessionRepository.save(userSession);

    const token = await this.tokenService.createToken(newUser, newUserSession);

    return {
      token,
      user: newUser,
    };
  }

  async login(body: LoginDto): Promise<LoginRto> {
    const user = await this.userCrudService.getUser({
      email: body.email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid phone number');
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const userSession = new UserSession({
      user_id: user,
    });

    const newUserSession = await this.userSessionRepository.save(userSession);

    const token = await this.tokenService.createToken(user, newUserSession);

    return {
      token,
    };
  }

  async logout(userSession: UserSession) {
    await this.userSessionRepository.delete(userSession);

    return logoutSuccessMessage;
  }

  async changePassword(user: User, body: ChangePasswordDto): Promise<LoginRto> {
    const isPasswordMatch = await bcrypt.compare(
      body.oldPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);

    await this.userCrudService.updateUser({
      ...user,
      password: hashedPassword,
    });

    await this.userSessionRepository.delete({
      user_id: user.id,
    } as FindOptionsWhere<UserSession>);

    const userSession = new UserSession({
      user_id: user,
    });

    const newUserSession = await this.userSessionRepository.save(userSession);

    const token = await this.tokenService.createToken(user, newUserSession);

    return {
      token,
    };
  }
}
