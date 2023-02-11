import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import { error } from 'console';
import { verify } from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface JwtPayLoad {
  name: string;
  id: number;
  iat: number;
  exp?: number;
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles: UserType[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (roles?.length) {
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split('Bearer ')[1];
      try {
        const payLoad = verify(token, process.env.JSON_TOKEN_KEY) as JwtPayLoad;
        const user = await this.prisma.user.findUnique({
          where: {
            id: payLoad.id,
          },
        });
        if (!user) return false;
        if (roles.includes(user.user_type)) return true;

        return false;
      } catch (err) {
        return false;
      }
    }
    return true;
  }
}
