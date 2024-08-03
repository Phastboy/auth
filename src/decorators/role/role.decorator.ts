import { SetMetadata } from '@nestjs/common';

/**
 * Role decorator
 *
 * @param string[] roles - the role to be set
 * */
export const Role = (...roles: string[]) => SetMetadata('roles', roles);
