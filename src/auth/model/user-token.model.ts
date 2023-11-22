import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { User } from 'src/@generated/user/user.model';

@ObjectType()
export class UserTokenObject extends PartialType(User) {
  @Field(() => String, { nullable: true })
  accessToken: string;

  @Field(() => String, { nullable: true })
  refreshToken: string;
}
