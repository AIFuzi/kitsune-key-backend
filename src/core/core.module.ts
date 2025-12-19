import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AccountModule } from '@/src/modules/auth/account/account.module'
import { SessionModule } from '@/src/modules/auth/session/session.module'
import { TotpModule } from '@/src/modules/auth/totp/totp.module'
import { NotificationModule } from '@/src/modules/notification/notification.module'
import { RoleModule } from '@/src/modules/permission/role/role.module'
import { HostVerificationModule } from '@/src/modules/verification/host-verification/host-verification.module'

import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    NotificationModule,
    AccountModule,
    RedisModule,
    SessionModule,
    TotpModule,
    RoleModule,
    HostVerificationModule,
  ],
})
export class CoreModule {}
