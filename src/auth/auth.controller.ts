import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Tokens } from 'src/types';
import { RefreshTokenGuard } from './guards/jwt-refresh-auth/jwt-refresh-auth.guard';

/**
 * AuthController handles HTTP requests related to authentication.
 * It uses AuthService to perform the necessary operations.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles POST /auth/register endpoint.
   * It creates a new user using the provided data.
   *
   * @param createAuthDto - Data provided by the user
   * @returns Result of the create user operation
   */
  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.createUser(createAuthDto);
  }

  /**
   * Handles POST /auth/login endpoint.
   * It logs in a user using the provided data.
   *
   * @returns Result of the login operation
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Request() request: Request): Promise<Tokens> {
    console.log({ request }); // Debugging line
    const refreshToken = request.headers['refresh-token'] as string;
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('No or invalid refresh token provided');
    }
    return this.authService.refresh(refreshToken);
  }
}
