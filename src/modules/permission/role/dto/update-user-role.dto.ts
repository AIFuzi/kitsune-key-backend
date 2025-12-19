import { IsNotEmpty, IsString } from 'class-validator'

import { UserRoleType } from '@prisma/generated/enums'

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsString()
  role: UserRoleType

  @IsNotEmpty()
  @IsString()
  userId: string
}
