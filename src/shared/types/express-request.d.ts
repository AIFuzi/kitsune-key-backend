import type { SessionMetadata } from '@/src/shared/types/session-metadata.type'
import { User } from '@prisma/generated/client'

declare global {
  namespace Express {
    interface Request {
      user?: User
      session: import('express-session').Session & {
        userId?: string
        createdAt?: Date | string
        metadata: SessionMetadata
      }
    }
  }
}
