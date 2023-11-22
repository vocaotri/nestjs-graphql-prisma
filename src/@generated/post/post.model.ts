import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { User } from '../user/user.model';

@ObjectType()
export class Post {

    @Field(() => ID, {nullable:false})
    id!: number;

    @Field(() => String, {nullable:false})
    title!: string;

    @Field(() => String, {nullable:true})
    content!: string | null;

    @Field(() => Boolean, {nullable:true,defaultValue:false})
    published!: boolean | null;

    @Field(() => Int, {nullable:true})
    authorId!: number | null;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => Date, {nullable:true})
    deletedAt!: Date | null;

    @Field(() => User, {nullable:true})
    author?: User | null;
}
