import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AccountModule } from '@/src/modules/auth/account/account.module'

import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AccountModule,
  ],
})
export class CoreModule {}
