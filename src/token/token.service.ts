import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload, Tokens } from '../types';
import { variables } from '../../constants';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async verify(token: string, secret: string): Promise<Payload> {
    try {
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      console.error('Token verification error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshTokenHasExpired(refreshToken: string): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: variables.jwtRefreshSecret,
      });
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error checking token expiration:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateTokens(
    user: User,
    previousRefreshToken?: string,
  ): Promise<Tokens> {
    try {
      const { password, salt, ...payload } = user;
      const accessToken = this.jwtService.sign(payload as Payload);
      const refreshToken = previousRefreshToken
        ? previousRefreshToken
        : this.jwtService.sign(payload as Payload, {
            secret: variables.jwtRefreshSecret,
            expiresIn: '7d',
          });
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error generating tokens:', error);
      throw new UnauthorizedException('Token generation error');
    }
  }
}
