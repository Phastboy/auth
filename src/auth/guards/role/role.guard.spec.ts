import { RoleGuard } from './role.guard';
import { Reflector } from '@nestjs/core';

describe('RoleGuard', () => {
  let reflector: Reflector;
  let roleGuard: RoleGuard;

  beforeEach(() => {
    reflector = new Reflector();
    roleGuard = new RoleGuard(reflector);
  });

  it('should be defined', () => {
    expect(roleGuard).toBeDefined();
  });
});
