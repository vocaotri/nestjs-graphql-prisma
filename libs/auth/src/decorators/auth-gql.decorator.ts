import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ROLES_KEY } from './roles.decorator';
import { JwtGqlAuthGuard } from '../guards/jwt-gql-auth.guard';
import { RolesGqlGuard } from '../guards/roles-gql.guard';
import { Role } from '../enums/role.enum';

export function AuthGql(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtGqlAuthGuard, RolesGqlGuard),
  );
}
