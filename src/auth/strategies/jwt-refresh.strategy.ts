import { Injectable } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { variables } from '../../../constants';

@Injectable()
export class JwtRefreshStrategy extends JwtStrategy {
  constructor() {
    super(variables.jwtRefreshSecret);
  }

  async validate(payload: any) {
    return {
      ...payload,
      refreshTokenExpiresAt: new Date(payload.refreshTokenExpiresAt * 1000),
    };
  }
}
