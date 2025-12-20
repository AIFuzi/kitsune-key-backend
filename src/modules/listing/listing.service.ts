import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { CreateListingDto } from '@/src/modules/listing/dto'
import { CreateNotificationDto } from '@/src/modules/notification/dto'
import { NotificationService } from '@/src/modules/notification/notification.service'
import { ListingStatusType, PropertyType, User } from '@prisma/generated/client'

@Injectable()
export class ListingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(host: User, dto: CreateListingDto) {
    const notification: CreateNotificationDto = {
      title: 'Your create new listing',
      description: 'The listing will be available after verification',
    }

    await this.notificationService.createNotification(notification, host.id)

    return this.prismaService.listing.create({
      data: {
        ...dto,
        hostId: host.id,
        verification: {
          create: {
            verificationStatus: ListingStatusType.PENDING,
          },
        },
      },
    })
  }

  async getAll(
    country: string,
    city: string,
    page: number,
    limit: number,
    type: PropertyType,
  ) {
    const skip = (page - 1) * limit

    const listings = await this.prismaService.listing.findMany({
      ...(skip
        ? {
            skip,
          }
        : {}),
      ...(limit
        ? {
            take: Number(limit),
          }
        : {}),

      where: {
        listingStatus: ListingStatusType.PUBLISHED,
        country: {
          equals: country,
          mode: 'insensitive',
        },
        ...(city
          ? {
              city: {
                equals: city,
                mode: 'insensitive',
              },
            }
          : {}),
        ...(type ? { propertyType: type } : {}),
      },
      omit: {
        description: true,
        amenities: true,
        hostId: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const total = await this.prismaService.listing.count({
      where: {
        listingStatus: ListingStatusType.PUBLISHED,
        country: {
          equals: country,
          mode: 'insensitive',
        },
        ...(city
          ? {
              city: {
                equals: city,
                mode: 'insensitive',
              },
            }
          : {}),
        ...(type ? { propertyType: type } : {}),
      },
    })

    return { listings, total }
  }

  async getOne(id: string) {
    return this.prismaService.listing.findUnique({
      where: {
        id,
      },
      include: {
        host: {
          select: {
            profileInfo: {
              select: {
                name: true,
                aboutMe: true,
                avatarUrl: true,
                birthday: true,
              },
            },
          },
        },
      },
    })
  }
}
