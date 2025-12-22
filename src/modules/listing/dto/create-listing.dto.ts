import { Type } from 'class-transformer'
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'

export class CreateListingDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  country: string

  @IsNotEmpty()
  @IsString()
  city: string

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  lat: number

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  lng: number

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  bedCount: number

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  bathCount: number

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  roomCount: number

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  price: number
}
