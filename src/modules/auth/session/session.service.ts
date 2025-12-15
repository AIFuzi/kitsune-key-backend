import { verify } from 'argon2'
import type { Request } from 'express'

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'
import { LoginUserDto } from '@/src/modules/auth/session/dto'
import {
  SESSION_NOT_FOUND_USER,
  USER_INVALID_PASSWORD,
  USER_NOT_FOUND,
} from '@/src/shared/messages'
import {
  destroySession,
  getSessionMetadata,
  saveSession,
} from '@/src/shared/utils'

@Injectable()
export class SessionService {
  constructor(
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async findSessionsByUser(req: Request) {
    const userId = req.session.userId

    if (!userId) {
      throw new NotFoundException(SESSION_NOT_FOUND_USER)
    }

    const keys = await this.redisService.keys('*')
    const userSessions = []

    for (const key of keys) {
      const sessionData = await this.redisService.get(key)

      if (sessionData) {
        const session = JSON.parse(sessionData)

        if (session.userId === userId) {
          userSessions.push({ ...session, id: key.split(':')[1] })
        }
      }
    }

    userSessions.sort((a, b) => b.createdAt - a.createdAt)

    return userSessions.filter(session => session.id !== req.session.id)
  }

  async login(req: Request, dto: LoginUserDto, userAgent: string) {
    const { email, password } = dto

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND)
    }

    const isValidPass = await verify(user.password, password)
    if (!isValidPass) {
      throw new UnauthorizedException(USER_INVALID_PASSWORD)
    }

    const metadata = getSessionMetadata(req, userAgent)

    return {
      user: saveSession(req, user, metadata),
    }
  }

  async logout(req: Request) {
    await destroySession(req, this.configService)
  }
}
