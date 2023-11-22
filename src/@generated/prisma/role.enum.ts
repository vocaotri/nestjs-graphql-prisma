import { registerEnumType } from '@nestjs/graphql';

export enum Role {
    user = "user",
    admin = "admin"
}


registerEnumType(Role, { name: 'Role', description: undefined })
