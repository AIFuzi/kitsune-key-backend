import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { UpdateUserRoleDto } from '@/src/modules/permission/role/dto'

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async UpdateUserRole(dto: UpdateUserRoleDto) {
    const { role, userId } = dto

    await this.prismaService.userRole.updateMany({
      where: { userId: userId },
      data: {
        roleType: role,
      },
    })

    return true
  }
}
