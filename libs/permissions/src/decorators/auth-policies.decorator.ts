import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ROLES_KEY } from 'y/auth/decorators/roles.decorator';
import { Role } from 'y/auth/enums/role.enum';
import { JwtAuthGuard } from 'y/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'y/auth/guards/roles.guard';
import { PermissionAction } from '../enums/permission-action ';
import { User } from 'src/@generated/user/user.model';
import { Post } from 'src/@generated/post/post.model';
import { PoliciesGuard } from '../guards/policies.guard';
import { CheckPolicies } from './check-policies.decorator';
import { AppAbility } from '../casl-ability.factory';

export interface IPolicy {
  action: PermissionAction;
  model: User | Post;
}

export interface AuthPoliciesArgs {
  roles: Role[];
  policy: IPolicy;
}

export function AuthPolicies(args: AuthPoliciesArgs) {
  const { roles, policy } = args;
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard, PoliciesGuard),
    CheckPolicies((ability: AppAbility) =>
      ability.can(policy.action, policy.model),
    ),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
