import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

import { ListingStatusType } from '@prisma/generated/enums'

export class UpdateListingVerificationDto {
  @IsNotEmpty()
  @IsUUID()
  id: string

  @IsOptional()
  @IsString()
  message: string

  @IsNotEmpty()
  @IsString()
  newStatus: ListingStatusType
}
