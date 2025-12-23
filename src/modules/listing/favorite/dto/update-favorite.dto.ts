import { IsNotEmpty, IsUUID } from 'class-validator'

export class UpdateFavoriteDto {
  @IsNotEmpty()
  @IsUUID()
  listingId: string
}
