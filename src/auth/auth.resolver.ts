import { UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/@generated/user/user.model';
import { AuthGqlUser } from 'y/auth/decorators/auth-gql-user.decorator';
import { AuthGql } from 'y/auth/decorators/auth-gql.decorator';
import { Role } from 'y/auth/enums/role.enum';
import { AuthService } from './auth.service';
import { UserLoginInput } from './inputs/user-login.input';
import { UserTokenObject } from './model/user-token.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User)
  @AuthGql(Role.User, Role.Admin)
  async me(@AuthGqlUser() user: User): Promise<User> {
    return user;
  }

  @Mutation(() => UserTokenObject)
  async login(
    @Args('userLoginInput') userLoginInput: UserLoginInput,
  ): Promise<UserTokenObject> {
    console.log(userLoginInput);
    const user = await this.authService.findByCredentials(userLoginInput);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
