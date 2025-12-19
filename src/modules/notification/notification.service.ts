import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { CreateNotificationDto } from '@/src/modules/notification/dto'
import { User } from '@prisma/generated/client'

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  async createNotification(dto: CreateNotificationDto, userId: string) {
    return this.prismaService.notification.create({
      data: {
        userId,
        ...dto,
      },
    })
  }

  async getUserUnreadNotifications(user: User) {
    return this.prismaService.notification.findMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async readNotifications(user: User) {
    await this.prismaService.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })
  }
}
