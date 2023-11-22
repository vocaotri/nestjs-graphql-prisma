import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AppAbility, CaslAbilityFactory } from '../casl-ability.factory';
import { PolicyHandler } from '../types/policy.type';
import { Reflector } from '@nestjs/core';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PoliciesGqlGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
