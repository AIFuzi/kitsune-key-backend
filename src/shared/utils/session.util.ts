import type { Request } from 'express'

import { InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
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
        return reject(new InternalServerErrorException(err))
      }

      resolve(user)
    })
  })
}

export function destroySession(req: Request, configService: ConfigService) {}
