import type { Request } from 'express'

import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common'
import { LoginUserDto } from '@/src/modules/auth/session/dto'
import { UserAgent } from '@/src/shared/decorators'
import { Authorization } from '@/src/shared/decorators/authorization.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

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

  @Post('logout')
  @Authorization()
  async logout(@Req() req: Request) {
    return this.sessionService.logout(req)
  }

  @Get()
  @Authorization()
  async getOtherSessionsByUser(@Req() req: Request) {
    return this.sessionService.findOtherSessionsByUser(req)
  }

  @Get('current')
  @Authorization()
  async getCurrentSession(@Req() req: Request) {
    return this.sessionService.findCurrentSession(req)
  }

  @Delete(':id')
  @Authorization()
  async removeSession(
    @Req() req: Request,
    @Param('id') id: string,
    @Authorized('id') userId: string,
  ) {
    return this.sessionService.removeSession(req, id, userId)
  }
}
