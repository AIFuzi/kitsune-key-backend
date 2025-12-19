import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { ROLES } from '@/src/shared/decorators/roles.decorator'
import { ACCESS_DENIED } from '@/src/shared/messages'
import { UserRoleType } from '@prisma/generated/enums'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesContext = this.reflector.getAllAndOverride<UserRoleType[]>(
      ROLES,
      [context.getHandler(), context.getClass()],
    )

    if (!rolesContext) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user
    const role = await this.prismaService.userRole.findFirst({
      where: { userId: user.id },
    })
    if (!rolesContext.includes(role.roleType)) {
      throw new ForbiddenException(ACCESS_DENIED)
    }

    return true
  }
}
