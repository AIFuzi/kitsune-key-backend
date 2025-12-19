import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { CreateNotificationDto } from '@/src/modules/notification/dto'
import { NotificationService } from '@/src/modules/notification/notification.service'
import { UpdateUserRoleDto } from '@/src/modules/permission/role/dto'
import { NotificationType } from '@prisma/generated/enums'

@Injectable()
export class RoleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async UpdateUserRole(dto: UpdateUserRoleDto) {
    const { role, userId } = dto

    await this.prismaService.userRole.updateMany({
      where: { userId: userId },
      data: {
        roleType: role,
      },
    })

    const updateRoleNotification: CreateNotificationDto = {
      title: 'Permission update',
      description: `Your permission has been updated ${role} successfully.`,
      notificationType: NotificationType.SUCCESS,
    }

    await this.notificationService.createNotification(
      updateRoleNotification,
      userId,
    )

    return true
  }
}
