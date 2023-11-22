import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import * as Validator from 'class-validator';
import { UserCreateNestedOneWithoutPostsInput } from '../user/user-create-nested-one-without-posts.input';

@InputType()
export class PostCreateInput {

    @Field(() => String, {nullable:false})
    @Validator.MinLength(3)
    @Validator.MaxLength(15)
    title!: string;

    @Field(() => String, {nullable:true})
    @Validator.MaxLength(2000)
    content?: string;

    @Field(() => Boolean, {nullable:true})
    published?: boolean;

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => Date, {nullable:true})
    deletedAt?: Date | string;

    @Field(() => UserCreateNestedOneWithoutPostsInput, {nullable:true})
    author?: UserCreateNestedOneWithoutPostsInput;
}
