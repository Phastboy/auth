import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { variables } from '../../constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PasswordModule } from '../password/password.module';
import { TokenModule } from '../token/token.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    PasswordModule,
    TokenModule,
    JwtModule.register({
      global: true,
      secret: variables.jwtSecret,
      signOptions: {
        expiresIn: variables.jwtTokenExpiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    {
      provide: JwtStrategy,
      useFactory: () => new JwtStrategy(variables.jwtSecret),
    },
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
