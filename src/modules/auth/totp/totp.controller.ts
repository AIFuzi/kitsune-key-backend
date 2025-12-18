import { Body, Controller, Get, Patch } from '@nestjs/common'
import { EnableTotpDto } from '@/src/modules/auth/totp/dto'
import { Authorization, Authorized } from '@/src/shared/decorators'
import { User } from '@prisma/generated/client'

import { TotpService } from './totp.service'

@Controller('totp')
export class TotpController {
  constructor(private readonly totpService: TotpService) {}

  @Get('generate')
  @Authorization()
  async generate2FA(@Authorized() user: User) {
    return this.totpService.generate2FA(user)
  }

  @Patch('enable')
  @Authorization()
  async enable2FA(@Authorized() user: User, @Body() dto: EnableTotpDto) {
    return this.totpService.enable2FA(user, dto)
  }

  @Patch('disable')
  @Authorization()
  async disable2FA(@Authorized() user: User) {
    return this.totpService.disable2FA(user)
  }
}
