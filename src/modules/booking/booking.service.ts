import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { CreateBookingDto } from '@/src/modules/booking/dto'
import {
  BOOKING_ALREADY_DATE_EXISTS,
  LISTING_NOT_FOUND,
} from '@/src/shared/messages'

@Injectable()
export class BookingService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBooking(dto: CreateBookingDto, userId: string) {
    const { endDate, startDate, listingId } = dto

    const existListing = await this.prismaService.listing.findUnique({
      where: {
        id: listingId,
      },
    })
    if (!existListing) {
      throw new NotFoundException(LISTING_NOT_FOUND)
    }

    const isConflict = await this.prismaService.booking.findFirst({
      where: {
        listingId,
        startDate: { lt: endDate },
        endDate: { gt: startDate },
      },
    })
    if (isConflict) {
      throw new BadRequestException(BOOKING_ALREADY_DATE_EXISTS)
    }

    const diffMs = endDate.getTime() - startDate.getTime()
    const totalDays = diffMs / (1000 * 60 * 60 * 24)
    const totalPrice = totalDays * existListing.price

    await this.prismaService.booking.create({
      data: {
        userId,
        startDate,
        endDate,
        totalPrice,
        listingId: existListing.id,
      },
    })

    return true
  }

  async getUserBookings(userId: string) {
    return this.prismaService.booking.findMany({
      where: {
        userId,
      },
      include: {
        listing: {
          omit: {
            description: true,
            lat: true,
            lng: true,
            discountPercent: true,
            price: true,
            amenities: true,
            listingStatus: true,
          },
        },
      },
    })
  }

  async getHostBookings(hostId: string) {
    return this.prismaService.booking.findMany({
      where: {
        listing: {
          hostId,
        },
      },
      include: {
        listing: {
          omit: {
            description: true,
            lat: true,
            lng: true,
            discountPercent: true,
            price: true,
            amenities: true,
            listingStatus: true,
          },
        },
      },
    })
  }
}
