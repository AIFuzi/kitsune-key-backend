import { TOTP } from 'otpauth'
import * as sharp from 'sharp'
import { v4 } from 'uuid'

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { S3Service } from '@/src/modules/libs/s3/s3.service'
import {
  CreateListingDto,
  DeleteListingDto,
  UpdateListingDto,
} from '@/src/modules/listing/listing/dto'
import { CreateNotificationDto } from '@/src/modules/notification/dto'
import { NotificationService } from '@/src/modules/notification/notification.service'
import {
  LISTING_NOT_FOUND,
  PIN_INCORRECT,
  TOTP_INVALID_PIN,
} from '@/src/shared/messages'
import {
  ListingStatusType,
  NotificationType,
  PropertyType,
  User,
} from '@prisma/generated/client'

@Injectable()
export class ListingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    host: User,
    dto: CreateListingDto,
    files: Express.Multer.File[],
  ) {
    const images = []

    for (const i in files) {
      const processedBuffer = await sharp(files[i].buffer).avif().toBuffer()

      const newFileName = `${v4()}.avif`

      await this.s3Service.upload(
        processedBuffer,
        newFileName,
        files[i].mimetype,
      )
      images.push(newFileName)
    }

    const notification: CreateNotificationDto = {
      title: 'Your create new listing',
      description: 'The listing will be available after verification',
    }

    await this.notificationService.createNotification(notification, host.id)

    return this.prismaService.listing.create({
      data: {
        ...dto,
        imageUrl: images,
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
                userId: true,
                name: true,
                avatarUrl: true,
                birthday: true,
              },
            },
          },
        },
      },
    })
  }

  async delete(host: User, dto: DeleteListingDto) {
    const { pin, id } = dto

    const isExist = await this.prismaService.listing.findUnique({
      where: {
        id,
        hostId: host.id,
      },
    })
    if (!isExist) {
      throw new NotFoundException(LISTING_NOT_FOUND)
    }

    if (host.isTotpEnabled) {
      if (!pin) {
        return { message: [PIN_INCORRECT] }
      }

      const totp = new TOTP({
        issuer: this.configService.getOrThrow<string>('TOTP_ISSUER'),
        digits: 6,
        label: `${host.email}`,
        algorithm: 'SHA1',
        secret: host.totpSecret,
      })

      const delta = totp.validate({ token: pin })
      if (delta === null) {
        throw new BadRequestException(TOTP_INVALID_PIN)
      }
    }

    const notification: CreateNotificationDto = {
      notificationType: NotificationType.SUCCESS,
      title: 'You listing has been deleted',
      description: 'Your listing successfully deleted',
    }

    await this.notificationService.createNotification(notification, host.id)
    for (const i in isExist.imageUrl) {
      await this.s3Service.remove(isExist.imageUrl[i])
    }

    await this.prismaService.listing.delete({
      where: {
        id,
        hostId: host.id,
      },
    })

    return true
  }

  async update(dto: UpdateListingDto, host: User) {
    if (host.isTotpEnabled) {
      const { pin } = dto
      if (!pin) {
        return { message: [PIN_INCORRECT] }
      }

      const totp = new TOTP({
        issuer: this.configService.getOrThrow<string>('TOTP_ISSUER'),
        digits: 6,
        label: `${host.email}`,
        algorithm: 'SHA1',
        secret: host.totpSecret,
      })

      const delta = totp.validate({ token: pin })
      if (delta === null) {
        throw new BadRequestException(TOTP_INVALID_PIN)
      }
    }

    const {
      id,
      propertyType,
      description,
      discountPercent,
      bedCount,
      roomCount,
      bathCount,
      title,
      price,
      amenities,
    } = dto

    const isExist = await this.prismaService.listing.findUnique({
      where: {
        id,
        hostId: host.id,
      },
    })
    if (!isExist) {
      throw new NotFoundException(LISTING_NOT_FOUND)
    }

    return this.prismaService.listing.update({
      where: {
        id,
      },
      data: {
        propertyType,
        description,
        discountPercent,
        bedCount,
        roomCount,
        bathCount,
        title,
        price,
        amenities,
      },
    })
  }

  async getHostListings(hostId: string) {
    return this.prismaService.listing.findMany({
      where: {
        hostId,
        listingStatus: ListingStatusType.PUBLISHED,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getMyListings(hostId: string) {
    return this.prismaService.listing.findMany({
      where: {
        hostId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
