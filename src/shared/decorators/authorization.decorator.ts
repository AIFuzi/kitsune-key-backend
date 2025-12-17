import { applyDecorators, UseGuards } from '@nestjs/common'
import { AuthorizationGuard } from '@/src/shared/guards'

export function Authorization() {
  return applyDecorators(UseGuards(AuthorizationGuard))
}
