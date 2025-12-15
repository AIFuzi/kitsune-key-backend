import type { Request } from 'express'

import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      const request: Request = ctx.switchToHttp().getRequest()

      return request.headers['user-agent']
    }
  },
)
