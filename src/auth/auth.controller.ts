import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Request,
  Get,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/jwt-refresh-auth/jwt-refresh-auth.guard';
import { Response } from 'express';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UsersService } from '../users/users.service';

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
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );

    res.cookie('accessToken', accessToken, this.cookieOptions);
    res.cookie('refreshToken', refreshToken, this.cookieOptions);

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

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(@Request() request: any, @Res() res: Response) {
    const oldRefreshToken = request.cookies['refreshToken'];
    const { accessToken, refreshToken } =
      await this.authService.refresh(oldRefreshToken);

    res.cookie('accessToken', accessToken, this.cookieOptions);
    res.cookie('refreshToken', refreshToken, this.cookieOptions);

    return res.json({ message: 'tokens refreshed successfully' });
  }
}
