import { Body, Controller, Get, Post, Put } from '@nestjs/common'
import {
  ApproveHostDto,
  RejectHostDto,
} from '@/src/modules/verification/host-verification/dto'
import { Authorization, Authorized } from '@/src/shared/decorators'
import { User } from '@prisma/generated/client'

import { HostVerificationService } from './host-verification.service'

@Controller('host-verification')
export class HostVerificationController {
  constructor(
    private readonly hostVerificationService: HostVerificationService,
  ) {}

  @Get()
  @Authorization('ADMIN')
  async getAllVerificationRequests() {
    return this.hostVerificationService.getAllVerificationRequests()
  }

  @Get('user')
  @Authorization()
  async getUserRequestStatus(@Authorized() user: User) {
    return this.hostVerificationService.getUserRequestStatus(user)
  }

  @Post()
  @Authorization('USER')
  async createVerificationRequest(@Authorized() user: User) {
    return this.hostVerificationService.createVerificationRequest(user)
  }

  @Put('approve')
  @Authorization('ADMIN')
  async approveVerificationRequest(@Body() dto: ApproveHostDto) {
    return this.hostVerificationService.approveVerificationRequest(dto)
  }

  @Put('reject')
  @Authorization('ADMIN')
  async rejectVerificationRequest(@Body() dto: RejectHostDto) {
    return this.hostVerificationService.rejectVerificationRequest(dto)
  }
}
