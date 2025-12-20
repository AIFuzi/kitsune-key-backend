import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { CreateNotificationDto } from '@/src/modules/notification/dto'
import { NotificationService } from '@/src/modules/notification/notification.service'
import { UpdateListingVerificationDto } from '@/src/modules/verification/listing-verification/dto'
import { ListingStatusType } from '@prisma/generated/enums'

@Injectable()
export class ListingVerificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async getListingsWithPendingStatus() {
    return this.prismaService.listing.findMany({
      where: {
        listingStatus: ListingStatusType.PENDING,
      },
    })
  }

  async updateVerificationStatus(dto: UpdateListingVerificationDto) {
    const { newStatus, id, message } = dto

    const listing = await this.prismaService.listing.update({
      where: {
        id,
      },
      data: {
        listingStatus: newStatus,
        verification: {
          update: {
            data: {
              verificationStatus: newStatus,
              message,
            },
          },
        },
      },
    })

    const notification: CreateNotificationDto = {
      title: 'Your listing status updated',
      description: `Your listing status updated. New status: ${newStatus}`,
    }

    await this.notificationService.createNotification(
      notification,
      listing.hostId,
    )

    return true
  }
}
