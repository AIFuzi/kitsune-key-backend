import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import {
  CreateListingDto,
  DeleteListingDto,
  UpdateListingDto,
} from '@/src/modules/listing/dto'
import { Authorization, Authorized } from '@/src/shared/decorators'
import { PropertyType, User } from '@prisma/generated/client'

import { ListingService } from './listing.service'

@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post('create')
  @Authorization('HOST')
  @UseInterceptors(FilesInterceptor('imageUrl'))
  async create(
    @Authorized() host: User,
    @Body() dto: CreateListingDto,
    @UploadedFiles() imageUrl: Express.Multer.File[],
  ) {
    return this.listingService.create(host, dto, imageUrl)
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

  @Get('by-host/:id')
  async getByHost(@Param('id') id: string) {
    return this.listingService.getHostListings(id)
  }

  @Get('by-me')
  @Authorization('HOST')
  async getMyListings(@Authorized('id') hostId: string) {
    return this.listingService.getMyListings(hostId)
  }

  @Delete('delete')
  @Authorization('HOST')
  async delete(@Authorized() host: User, @Body() dto: DeleteListingDto) {
    return this.listingService.delete(host, dto)
  }

  @Patch('update')
  @Authorization('HOST')
  async update(@Authorized() host: User, @Body() dto: UpdateListingDto) {
    return this.listingService.update(dto, host)
  }
}
