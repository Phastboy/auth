import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { variables } from '../../../constants';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(secretOrKey: string = variables.jwtSecret) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: any) {
    return { ...payload };
  }
}
