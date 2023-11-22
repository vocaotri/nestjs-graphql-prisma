import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/@generated/user/user.model';
import { FindManyPostArgs } from 'src/@generated/post/find-many-post.args';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  postsByUser(user: Partial<User>, args: FindManyPostArgs): any {
    return this.prisma.post.findMany({
      ...args,
      where: {
        ...args.where,
        authorId: user.id,
      },
    });
  }
}
