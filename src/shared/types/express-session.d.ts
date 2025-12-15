import type { SessionMetadata } from '@/src/shared/types/session-metadata.type'

declare module 'express-session' {
  import 'express-session'

  interface SessionData {
    userId?: string
    createdAt?: Date | string
    metadata: SessionMetadata
  }
}
