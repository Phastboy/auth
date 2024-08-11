import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { Role } from '../decorators/role/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('admin')
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('admin')
  @Delete(':username')
  delete(@Param('username') username: string) {
    return this.usersService.delete(username);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('admin')
  @Get('stats')
  stats() {
    const totalUsers = this.usersService.getToTalUserCount();
    const rolesDistribution = this.usersService.getUserRolesDistribution();
    return { totalUsers, rolesDistribution };
  }
}
