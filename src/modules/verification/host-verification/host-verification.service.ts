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

  async getAllVerificationRequests() {
    return this.prismaService.hostVefification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async createVerificationRequest(user: User) {
    const isRequestExist = await this.prismaService.hostVefification.findUnique(
      {
        where: {
          userId: user.id,
        },
      },
    )
    if (
      isRequestExist &&
      isRequestExist.verificationStatus !== HostVerificationStatusType.REJECT
    ) {
      throw new ConflictException(HOST_CONFLICT)
    }

    if (!isRequestExist) {
      await this.prismaService.hostVefification.create({
        data: {
          userId: user.id,
        },
      })
    }

    if (
      isRequestExist &&
      isRequestExist.verificationStatus === HostVerificationStatusType.REJECT
    ) {
      await this.prismaService.hostVefification.update({
        where: {
          userId: user.id,
        },
        data: {
          verificationStatus: HostVerificationStatusType.PENDING,
          message: null,
        },
      })
    }

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

  async getUserRequestStatus(user: User) {
    return this.prismaService.hostVefification.findUnique({
      where: {
        userId: user.id,
      },
    })
  }
}
