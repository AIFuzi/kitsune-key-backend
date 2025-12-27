import { Body, Controller, Get, Post } from '@nestjs/common'
import { CreateBookingDto } from '@/src/modules/booking/dto'
import { Authorization, Authorized } from '@/src/shared/decorators'

import { BookingService } from './booking.service'

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('create')
  @Authorization()
  async createBooking(
    @Authorized('id') userId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingService.createBooking(dto, userId)
  }

  @Get('user')
  @Authorization()
  async getUserBookings(@Authorized('id') userId: string) {
    return this.bookingService.getUserBookings(userId)
  }

  @Get('host')
  @Authorization('HOST')
  async getHostBookings(@Authorized('id') hostId: string) {
    return this.bookingService.getHostBookings(hostId)
  }
}
