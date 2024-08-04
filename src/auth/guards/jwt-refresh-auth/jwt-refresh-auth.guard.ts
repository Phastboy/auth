import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { variables } from '../../../../constants';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.headers['refresh-token'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: variables.jwtRefreshSecret,
      });
      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
