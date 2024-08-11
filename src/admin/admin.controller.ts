import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { Role } from '../decorators/role/role.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('admin')
  @Get('users/stats')
  stats() {
    const totalUsers = this.adminService.getToTalUserCount();
    const rolesDistribution = this.adminService.getUserRolesDistribution();
    return { totalUsers, rolesDistribution };
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('admin')
  @Delete('users/:username')
  delete(@Param('username') username: string) {
    return this.adminService.delete(username);
  }
}
