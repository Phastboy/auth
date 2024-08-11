import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Request,
  Get,
  UnauthorizedException,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Tokens } from 'src/types';
import { RefreshTokenGuard } from './guards/jwt-refresh-auth/jwt-refresh-auth.guard';
import { Response } from 'express';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  private readonly isProduction = process.env.NODE_ENV === 'production';
  private readonly cookieOptions: any = {
    httpOnly: true,
    secure: this.isProduction,
    sameSite: this.isProduction ? 'None' : 'Lax',
    path: '/',
  };

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.createUser(createUserDto);

    res.cookie('accessToken', accessToken, this.cookieOptions);
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    return res.json({ message: 'Registration successful' });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any, @Res() res: Response) {
    const tokens = await this.authService.login(req.user);

    res.cookie('accessToken', tokens.accessToken, this.cookieOptions);
    res.cookie('refreshToken', tokens.refreshToken, this.cookieOptions);

    return res.json({ message: 'Login successful' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = req.user._id;
    return this.usersService.update(userId, updateUserDto);
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
