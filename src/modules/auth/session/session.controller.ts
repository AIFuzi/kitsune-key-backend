import type { Request } from 'express'

import { Body, Controller, Post, Req } from '@nestjs/common'
import { LoginUserDto } from '@/src/modules/auth/session/dto'
import { UserAgent } from '@/src/shared/decorators'

import { SessionService } from './session.service'

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('login')
  async login(
    @Req() req: Request,
    @Body() dto: LoginUserDto,
    @UserAgent() userAgent: string,
  ) {
    return this.sessionService.login(req, dto, userAgent)
  }
}
