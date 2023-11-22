import { registerEnumType } from '@nestjs/graphql';

export enum PostScalarFieldEnum {
    id = "id",
    title = "title",
    content = "content",
    published = "published",
    authorId = "authorId",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    deletedAt = "deletedAt"
}


registerEnumType(PostScalarFieldEnum, { name: 'PostScalarFieldEnum', description: undefined })
