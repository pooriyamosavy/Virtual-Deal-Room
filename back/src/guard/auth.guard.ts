import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Token } from 'src/@types/token';
import { ERole, IS_ROLE_KEY } from 'src/decorator/Role.decorator';
import { UserService } from 'src/routes/user/user.service';
import { TokenService } from 'src/services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const Role = this.reflector.get<keyof typeof ERole>(
      IS_ROLE_KEY,
      context.getHandler(),
    );

    if (Role === ERole.public) {
      return true;
    }

    console.log('the route is protected');
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('token not found', { authHeader });
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    console.log('token', { token });

    const decoded = (await this.tokenService.verifyToken(token)) as Token;
    console.log('decoded token', { decoded });
    const userSession = await this.userService.getUserSessionById(
      decoded.userSessionid,
    );
    console.log('user session found', { userSession });
    const user = await this.userService.getUser({ id: decoded.userId });
    console.log('user found', { user });

    if (!userSession) {
      throw new UnauthorizedException('User session not found');
    }
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    console.log('user stored in request');
    request.user = user;
    request.userSession = userSession;
    return true;
  }
}
