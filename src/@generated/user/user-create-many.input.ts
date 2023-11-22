import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import * as Validator from 'class-validator';
import { Role } from '../prisma/role.enum';

@InputType()
export class UserCreateManyInput {

    @Field(() => Int, {nullable:true})
    id?: number;

    @Field(() => String, {nullable:false})
    @Validator.IsEmail()
    email!: string;

    @Field(() => String, {nullable:false})
    @Validator.MaxLength(25)
    firstName!: string;

    @Field(() => String, {nullable:false})
    @Validator.MaxLength(25)
    lastName!: string;

    @Field(() => String, {nullable:true})
    @Validator.MaxLength(25)
    middleName?: string;

    @Field(() => String, {nullable:true})
    fullName?: string;

    @Field(() => String, {nullable:false})
    password!: string;

    @Field(() => Role, {nullable:true})
    role?: keyof typeof Role;

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;
}
