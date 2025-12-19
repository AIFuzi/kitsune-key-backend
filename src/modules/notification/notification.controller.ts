import { Controller, Get, Put } from '@nestjs/common'
import { Authorization, Authorized } from '@/src/shared/decorators'
import { User } from '@prisma/generated/client'

import { NotificationService } from './notification.service'

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @Authorization()
  async getUserUnreadNotifications(@Authorized() user: User) {
    return this.notificationService.getUserUnreadNotifications(user)
  }

  @Put()
  @Authorization()
  async readNotifications(@Authorized() user: User) {
    return this.notificationService.readNotifications(user)
  }
}
