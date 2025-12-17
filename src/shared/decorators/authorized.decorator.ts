import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '@prisma/generated/client'

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    let user: User

    if (ctx.getType() === 'http') {
      user = ctx.switchToHttp().getRequest().user
    }

    return data ? user[data] : user
  },
)
