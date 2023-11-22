import { Injectable } from '@nestjs/common';
import { FindManyUserArgs } from 'src/@generated/user/find-many-user.args';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async index(args: FindManyUserArgs, hasPostCount = false) {
    const resultArgs: any = {
      ...args,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        middleName: true,
        fullName: true,
        role: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    };
    if (hasPostCount) {
      resultArgs.select._count = {
        select: {
          posts: true,
        },
      };
    }
    return this.prisma.user.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                published: true,
              },
            },
          },
        },
      },
      orderBy: {
        posts: {
          _count: 'asc',
        },
      },
    });
  }

  async indexCount(args: FindManyUserArgs) {
    return this.prisma.user.count({
      where: args.where,
      cursor: args.cursor,
      orderBy: args.orderBy,
      skip: args.skip,
      take: args.take,
    });
  }
}
