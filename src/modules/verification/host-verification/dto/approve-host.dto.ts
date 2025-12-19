import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class ApproveHostDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string
}
