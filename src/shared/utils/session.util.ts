import type { Request } from 'express'

import { InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  SESSION_FAILED_CREATE_SESSION,
  SESSION_FAILED_DESTROY_SESSION,
} from '@/src/shared/messages'
import { SessionMetadata } from '@/src/shared/types'
import { User } from '@prisma/generated/client'

export function saveSession(
  req: Request,
  user: User,
  metadata: SessionMetadata,
) {
  return new Promise((resolve, reject) => {
    req.session.createdAt = new Date()
    req.session.userId = user.id
    req.session.metadata = metadata

    req.session.save(err => {
      if (err) {
        return reject(
          new InternalServerErrorException(SESSION_FAILED_CREATE_SESSION),
        )
      }

      resolve(user)
    })
  })
}

export function destroySession(req: Request, configService: ConfigService) {
  return new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) {
        reject(new InternalServerErrorException(SESSION_FAILED_DESTROY_SESSION))
      }

      req.res.clearCookie(configService.getOrThrow<string>('SESSION_NAME'))
      resolve(true)
    })
  })
}
