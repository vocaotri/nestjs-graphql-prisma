import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';
import { Role } from '../prisma/role.enum';
import { Post } from '../post/post.model';
import { UserCount } from './user-count.output';

@ObjectType()
export class User {

    @Field(() => ID, {nullable:false})
    id!: number;

    @Field(() => String, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:false})
    firstName!: string;

    @Field(() => String, {nullable:false})
    lastName!: string;

    @Field(() => String, {nullable:true})
    middleName!: string | null;

    @Field(() => String, {nullable:true})
    fullName!: string | null;

    @HideField()
    password!: string;

    @Field(() => Role, {nullable:false,defaultValue:'user'})
    role!: keyof typeof Role;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => [Post], {nullable:true})
    posts?: Array<Post>;

    @Field(() => UserCount, {nullable:false})
    _count?: UserCount;
}
