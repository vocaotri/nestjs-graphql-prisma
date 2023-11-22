import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserTokenObject } from './model/user-token.model';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserLoginInput } from './inputs/user-login.input';
import { EJwtToken } from './enums/jwt-token.enum';
import { User } from 'src/@generated/user/user.model';
import { FindManyPostArgs } from 'src/@generated/post/find-many-post.args';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async findOneAndValidateUser(id: number, tokenType: EJwtToken) {
    if (tokenType !== EJwtToken.AccessToken) {
      return null;
    }
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        fullName: true,
        middleName: true,
        role: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: {
              where: { published: true },
            },
          },
        },
      },
    });
  }
  async findByCredentials(
    userLoginInput: UserLoginInput,
  ): Promise<UserTokenObject> {
    let user = await this.prisma.user.findUniqueOrThrow({
      where: { email: userLoginInput.email },
    });
    const isMatch = await bcrypt.compare(
      userLoginInput.password,
      user.password,
    );
    if (!user || !isMatch) {
      user = null;
    }
    const userWithToken: UserTokenObject = {
      ...user,
      accessToken: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        type: EJwtToken.AccessToken,
      }),
      refreshToken: this.jwtService.sign(
        { sub: user.id, type: EJwtToken.RefreshToken },
        { expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') },
      ),
    };
    return userWithToken;
  }
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
