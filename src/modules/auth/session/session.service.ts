import { verify } from 'argon2'
import type { Request } from 'express'

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'
import { LoginUserDto } from '@/src/modules/auth/session/dto'
import {
  SESSION_NOT_FOUND,
  SESSION_NOT_FOUND_USER,
  SESSION_REMOVE_CONFLICT,
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

  async findCurrentSession(req: Request) {
    const sessionId = req.session.id

    const sessionName = `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
    const sessionData = await this.redisService.get(sessionName)

    const session = JSON.parse(sessionData)

    return { ...session, id: sessionId }
  }

  async findOtherSessionsByUser(req: Request) {
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

  async removeSession(req: Request, id: string) {
    if (req.session.id == id) {
      throw new ConflictException(SESSION_REMOVE_CONFLICT)
    }

    const sessionName = `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`
    const isSessionExist = await this.redisService.get(sessionName)
    if (!isSessionExist) {
      throw new NotFoundException(SESSION_NOT_FOUND)
    }

    await this.redisService.del(sessionName)

    return true
  }
}
