import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

import { NotificationType } from '@prisma/generated/enums'

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 16)
  title: string

  @IsNotEmpty()
  @IsString()
  @Length(1, 128)
  description: string

  @IsOptional()
  @IsString()
  notificationType?: NotificationType
}
