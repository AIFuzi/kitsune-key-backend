import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { CreateNotificationDto } from '@/src/modules/notification/dto'
import { NotificationService } from '@/src/modules/notification/notification.service'
import { UpdateUserRoleDto } from '@/src/modules/permission/role/dto'
import { RoleService } from '@/src/modules/permission/role/role.service'
import {
  ApproveHostDto,
  RejectHostDto,
} from '@/src/modules/verification/host-verification/dto'
import {
  HOST_APPROVE_CONFLICT,
  HOST_CONFLICT,
  HOST_REJECT_CONFLICT,
} from '@/src/shared/messages'
import {
  HostVerificationStatusType,
  NotificationType,
  User,
  UserRoleType,
} from '@prisma/generated/client'

@Injectable()
export class HostVerificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly roleService: RoleService,
  ) {}

  async createVerificationRequest(user: User) {
    const isExist = await this.prismaService.hostVefification.findUnique({
      where: {
        userId: user.id,
        verificationStatus: {
          not: HostVerificationStatusType.REJECT,
        },
      },
    })
    if (isExist) {
      throw new ConflictException(HOST_CONFLICT)
    }

    //=================================================//
    //========== НАЧАЛО ЕБАНОГО КОСТЫЛЯ ===============//
    //=================================================//

    await this.prismaService.hostVefification.delete({
      where: {
        userId: user.id,
        verificationStatus: HostVerificationStatusType.REJECT,
      },
    })

    //=================================================//
    //========== КОНЕЦ ЕБАНОГО КОСТЫЛЯ ================//
    //=================================================//

    await this.prismaService.hostVefification.create({
      data: {
        userId: user.id,
      },
    })

    const sendRequestVerificationNotification: CreateNotificationDto = {
      title: 'Request send',
      description: 'Your request was sent to the verification status',
    }

    await this.notificationService.createNotification(
      sendRequestVerificationNotification,
      user.id,
    )

    return true
  }

  async approveVerificationRequest(dto: ApproveHostDto) {
    const { userId } = dto

    const isApproved = await this.prismaService.hostVefification.findUnique({
      where: {
        userId,
        verificationStatus: HostVerificationStatusType.APPROVED,
      },
    })
    if (isApproved) {
      throw new ConflictException(HOST_APPROVE_CONFLICT)
    }

    const updateDto: UpdateUserRoleDto = {
      userId,
      role: UserRoleType.HOST,
    }

    await this.roleService.UpdateUserRole(updateDto)

    await this.prismaService.hostVefification.update({
      where: {
        userId,
      },
      data: {
        verificationStatus: HostVerificationStatusType.APPROVED,
      },
    })

    const approveNotification: CreateNotificationDto = {
      title: 'You approved',
      description: 'Your host status is approved',
      notificationType: NotificationType.SUCCESS,
    }

    await this.notificationService.createNotification(
      approveNotification,
      userId,
    )

    return true
  }

  async rejectVerificationRequest(dto: RejectHostDto) {
    const { userId, message } = dto

    const isRejected = await this.prismaService.hostVefification.findUnique({
      where: {
        userId,
        verificationStatus: HostVerificationStatusType.REJECT,
      },
    })
    if (isRejected) {
      throw new ConflictException(HOST_REJECT_CONFLICT)
    }

    await this.prismaService.hostVefification.update({
      where: {
        userId,
      },
      data: {
        verificationStatus: HostVerificationStatusType.REJECT,
        message,
      },
    })

    const rejectNotification: CreateNotificationDto = {
      title: 'Request warning!',
      description: message,
      notificationType: NotificationType.WARNING,
    }

    await this.notificationService.createNotification(
      rejectNotification,
      userId,
    )

    return true
  }
}
