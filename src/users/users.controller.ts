import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

/**
 * UsersController handles HTTP requests related to user operations.
 * It uses UsersService to perform the necessary operations.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
