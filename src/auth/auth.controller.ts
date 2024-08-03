import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

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
   * @param loginDto - Data provided by the user
   * @returns Result of the login operation
   */
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
