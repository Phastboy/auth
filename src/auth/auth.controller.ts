import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Tokens } from 'src/types';
import { RefreshTokenGuard } from './guards/jwt-refresh-auth/jwt-refresh-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.createUser(createAuthDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Request() request: Request): Promise<Tokens> {
    console.log({ request });
    const refreshToken = request.headers['refresh-token'] as string;
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('No or invalid refresh token provided');
    }
    return this.authService.refresh(refreshToken);
  }
}
