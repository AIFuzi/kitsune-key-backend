import type { Request } from 'express'

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { USER_UNAUTHORIZED } from '@/src/shared/messages'

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    if (typeof request.session.userId === 'undefined') {
      throw new UnauthorizedException(USER_UNAUTHORIZED)
    }

    request.user = await this.prismaService.user.findUnique({
      where: { id: request.session.userId },
    })

    return true
  }
}
