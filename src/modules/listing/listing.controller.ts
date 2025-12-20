import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { CreateListingDto } from '@/src/modules/listing/dto'
import { Authorization, Authorized } from '@/src/shared/decorators'
import { PropertyType, User } from '@prisma/generated/client'

import { ListingService } from './listing.service'

@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post('create')
  @Authorization('HOST')
  async create(@Authorized() host: User, @Body() dto: CreateListingDto) {
    return this.listingService.create(host, dto)
  }

  @Get('all/:country')
  async getAll(
    @Param('country') country: string,
    @Query('city') city: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('property-type') type: PropertyType,
  ) {
    return this.listingService.getAll(country, city, page, limit, type)
  }

  @Get('current/:id')
  async getOne(@Param('id') id: string) {
    return this.listingService.getOne(id)
  }
}
