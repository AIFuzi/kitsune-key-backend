import { Module } from '@nestjs/common';
import { ListingVerificationService } from './listing-verification.service';
import { ListingVerificationController } from './listing-verification.controller';

@Module({
  controllers: [ListingVerificationController],
  providers: [ListingVerificationService],
})
export class ListingVerificationModule {}
