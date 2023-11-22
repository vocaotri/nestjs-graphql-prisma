import {
  Args,
  Info,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { Post } from 'src/@generated/post/post.model';
import { User } from 'src/@generated/user/user.model';
import { FindManyPostArgs } from 'src/@generated/post/find-many-post.args';
import { PostService } from 'src/post/post.service';
import { Role } from 'y/auth/enums/role.enum';
import { AuthGql } from 'y/auth/decorators/auth-gql.decorator';
import { FindManyUserArgs } from 'src/@generated/user/find-many-user.args';
import { GraphQLResolveInfo } from 'graphql';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Query(() => [User])
  @AuthGql(Role.Admin)
  async getListUserAdmin(
    @Info() info: GraphQLResolveInfo | any,
    @Args() args: FindManyUserArgs,
  ): Promise<User[]> {
    const hasCount = info.fieldNodes[0].selectionSet.selections.some((item) => {
      return item.name.value === '_count';
    });
    let hasPostCount = false;
    if (hasCount) {
      hasPostCount = info.fieldNodes[0].selectionSet.selections.some((item) => {
        return (
          item.name.value === '_count' &&
          item.selectionSet.selections.some((itemC) => {
            return itemC.name.value === 'posts';
          })
        );
      });
    }
    return this.userService.index(args, hasPostCount);
  }

  @Query(() => Int)
  @AuthGql(Role.Admin)
  async countListUserAdmin(@Args() args: FindManyUserArgs): Promise<number> {
    return this.userService.indexCount(args);
  }

  @ResolveField(() => [Post])
  async posts(
    @Parent() user: Partial<User>,
    @Args() args: FindManyPostArgs,
  ): Promise<Post[]> {
    return this.postService.postsByUser(user, args);
  }
}
