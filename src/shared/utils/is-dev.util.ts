import * as dotenv from 'dotenv'

import { ConfigService } from '@nestjs/config'

dotenv.config()

export function isDev(configService: ConfigService) {
  return configService.getOrThrow<string>('IS_DEV') === 'development'
}

export const IS_DEV_ENV = (process.env.IS_DEV = 'development')
