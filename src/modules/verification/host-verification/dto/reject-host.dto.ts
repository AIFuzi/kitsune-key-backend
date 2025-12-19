import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator'

export class RejectHostDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string

  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  message: string
}
