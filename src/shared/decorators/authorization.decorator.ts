import { applyDecorators, UseGuards } from '@nestjs/common'
import { Roles } from '@/src/shared/decorators/roles.decorator'
import { AuthorizationGuard, RolesGuard } from '@/src/shared/guards'
import { UserRoleType } from '@prisma/generated/enums'

export function Authorization(...roles: UserRoleType[]) {
  if (roles.length > 0) {
    return applyDecorators(
      Roles(...roles),
      UseGuards(AuthorizationGuard, RolesGuard),
    )
  }

  return applyDecorators(UseGuards(AuthorizationGuard))
}
