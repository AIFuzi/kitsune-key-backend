import { verify } from 'argon2'
import type { Request } from 'express'

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'
import { LoginUserDto } from '@/src/modules/auth/session/dto'
import { USER_INVALID_PASSWORD, USER_NOT_FOUND } from '@/src/shared/messages'
import { getSessionMetadata, saveSession } from '@/src/shared/utils'

@Injectable()
export class SessionService {
  constructor(
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService,
  ) {}

  async login(req: Request, dto: LoginUserDto, userAgent: string) {
    const { email, totp, password } = dto

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND)
    }

    // const isValidPass = await verify(password, user.password)
    const isValidPass = await verify(user.password, password)
    if (!isValidPass) {
      throw new UnauthorizedException(USER_INVALID_PASSWORD)
    }

    const metadata = getSessionMetadata(req, userAgent)

    return {
      user: saveSession(req, user, metadata),
    }
  }
}
