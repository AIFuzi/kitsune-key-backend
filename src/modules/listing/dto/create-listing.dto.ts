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
  lat: number

  @IsNotEmpty()
  @IsNumber()
  lng: number

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

  @IsNotEmpty()
  @IsNumber()
  price: number
}
