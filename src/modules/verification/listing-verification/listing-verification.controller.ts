import { Body, Controller, Get, Put } from '@nestjs/common'
import { UpdateListingVerificationDto } from '@/src/modules/verification/listing-verification/dto'
import { Authorization } from '@/src/shared/decorators'

import { ListingVerificationService } from './listing-verification.service'

@Controller('listing-verification')
export class ListingVerificationController {
  constructor(
    private readonly listingVerificationService: ListingVerificationService,
  ) {}

  @Get()
  @Authorization('ADMIN')
  async getListingsWithPendingStatus() {
    return this.listingVerificationService.getListingsWithPendingStatus()
  }

  @Put('update')
  @Authorization('ADMIN')
  async updateVerificationStatus(@Body() dto: UpdateListingVerificationDto) {
    return this.listingVerificationService.updateVerificationStatus(dto)
  }
}
