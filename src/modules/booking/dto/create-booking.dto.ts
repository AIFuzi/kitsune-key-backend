import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator'

export class CreateBookingDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date

  @IsNotEmpty()
  @IsUUID()
  listingId: string
}
