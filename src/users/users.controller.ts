import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

/**
 * UsersController handles HTTP requests related to user operations.
 * It uses UsersService to perform the necessary operations.
 */
@Controller('users')
export class UsersController {
  /**
   * Constructor is used to inject the required services.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Handles GET /users endpoint.
   *
   * @returns List of all users
   * */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Handles GET /users/:username endpoint.
   *
   * @param username - The username of the user
   * @returns The user document
   */
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  /**
   * Handles DELETE /users/:username endpoint.
   *
   * @param username - The username of the user
   * @returns The deleted user document
   */
  @Delete(':username')
  delete(@Param('username') username: string) {
    return this.usersService.delete(username);
  }
}
