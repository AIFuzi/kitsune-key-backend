import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AccountModule } from '@/src/modules/auth/account/account.module'
import { SessionModule } from '@/src/modules/auth/session/session.module'
import { TotpModule } from '@/src/modules/auth/totp/totp.module'
import { S3Module } from '@/src/modules/libs/s3/s3.module'
import { FavoriteModule } from '@/src/modules/listing/favorite/favorite.module'
import { ListingModule } from '@/src/modules/listing/listing/listing.module'
import { NotificationModule } from '@/src/modules/notification/notification.module'
import { RoleModule } from '@/src/modules/permission/role/role.module'
import { ProfileModule } from '@/src/modules/profile/profile.module'
import { HostVerificationModule } from '@/src/modules/verification/host-verification/host-verification.module'
import { ListingVerificationModule } from '@/src/modules/verification/listing-verification/listing-verification.module'

import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    S3Module,
    NotificationModule,
    AccountModule,
    RedisModule,
    SessionModule,
    TotpModule,
    RoleModule,
    ProfileModule,
    HostVerificationModule,
    ListingModule,
    FavoriteModule,
    ListingVerificationModule,
  ],
})
export class CoreModule {}
