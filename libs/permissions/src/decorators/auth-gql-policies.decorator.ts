import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ROLES_KEY } from 'y/auth/decorators/roles.decorator';
import { JwtGqlAuthGuard } from 'y/auth/guards/jwt-gql-auth.guard';
import { RolesGqlGuard } from 'y/auth/guards/roles-gql.guard';
import { AppAbility } from '../casl-ability.factory';
import { PoliciesGqlGuard } from '../guards/policies-gql.guard';
import { AuthPoliciesArgs } from './auth-policies.decorator';
import { CheckPolicies } from './check-policies.decorator';

export function AuthGqlPolicies(args: AuthPoliciesArgs) {
  const { roles, policy } = args;
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtGqlAuthGuard, RolesGqlGuard, PoliciesGqlGuard),
    CheckPolicies((ability: AppAbility) =>
      ability.can(policy.action, policy.model),
    ),
  );
}
