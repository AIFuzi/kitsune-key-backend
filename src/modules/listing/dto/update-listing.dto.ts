import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator'

import { ListingStatusType, PropertyType } from '@prisma/generated/enums'

export class UpdateListingDto {
  @IsNotEmpty()
  @IsUUID()
  id: string

  @IsString()
  @IsOptional()
  title: string

  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsString()
  propertyType: PropertyType

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10)
  bedCount: number

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10)
  bathCount: number

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10)
  roomCount: number

  @IsOptional()
  @IsNumber()
  @Min(1)
  price: number

  @IsOptional()
  @IsNumber()
  discountPercent: number

  @IsString()
  @IsOptional()
  pin?: string
}
