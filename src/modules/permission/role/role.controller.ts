import { Body, Controller, Patch } from '@nestjs/common'
import { UpdateUserRoleDto } from '@/src/modules/permission/role/dto'
import { Authorization } from '@/src/shared/decorators'

import { RoleService } from './role.service'

@Controller('permission')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Patch('update')
  @Authorization('ADMIN')
  async updateUserRole(@Body() dto: UpdateUserRoleDto) {
    return this.roleService.UpdateUserRole(dto)
  }
}
