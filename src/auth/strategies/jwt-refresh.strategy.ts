import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { variables } from '../../../constants';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['refreshToken'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: variables.jwtRefreshSecret, // Use the refresh token secret
    });
  }

  async validate(payload: any) {
    return {
      ...payload,
      refreshTokenExpiresAt: new Date(payload.refreshTokenExpiresAt * 1000),
    };
  }
}
