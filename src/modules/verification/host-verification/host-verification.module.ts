import { Module } from '@nestjs/common'
import { RoleModule } from '@/src/modules/permission/role/role.module'

import { HostVerificationController } from './host-verification.controller'
import { HostVerificationService } from './host-verification.service'

@Module({
  imports: [RoleModule],
  controllers: [HostVerificationController],
  providers: [HostVerificationService],
})
export class HostVerificationModule {}
