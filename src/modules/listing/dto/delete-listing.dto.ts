import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class DeleteListingDto {
  @IsNotEmpty()
  @IsUUID()
  id: string

  @IsString()
  @IsOptional()
  pin?: string
}
