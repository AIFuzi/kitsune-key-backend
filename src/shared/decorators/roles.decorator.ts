import { SetMetadata } from '@nestjs/common'
import { UserRoleType } from '@prisma/generated/enums'

export const ROLES = 'roles'
export const Roles = (...roles: UserRoleType[]) => SetMetadata(ROLES, roles)
