import { RedisStore } from 'connect-redis'
import * as session from 'express-session'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { CoreModule } from '@/src/core/core.module'
import { RedisService } from '@/src/core/redis/redis.service'
import { ms, parseBoolean, StringValue } from '@/src/shared/utils'

async function bootstrap() {
  const app = await NestFactory.create(CoreModule)

  const config = app.get(ConfigService)
  const redis = app.get(RedisService)

  app.setGlobalPrefix(config.getOrThrow<string>('PREFIX'))
  app.useGlobalPipes(new ValidationPipe())

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(
          config.getOrThrow<StringValue>('SESSION_HTTP_ONLY'),
        ),
        secure: parseBoolean(config.getOrThrow<StringValue>('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow<StringValue>('SESSION_FOLDER'),
      }),
    }),
  )

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOW_ORIGINS'),
    credentials: true,
    exposeHeaders: ['set-cookie'],
  })

  await app.listen(config.getOrThrow<string>('PORT'))
}

void bootstrap()
