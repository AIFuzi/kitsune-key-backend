import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
import {
  ChangeEmailDto,
  ChangePasswordDto,
  CreateAccountDto,
} from '@/src/modules/auth/account/dto'
import { Authorization, Authorized } from '@/src/shared/decorators'
import { User } from '@prisma/generated/client'

import { AccountService } from './account.service'

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  async create(@Body() dto: CreateAccountDto) {
    return this.accountService.create(dto)
  }

  @Get()
  @Authorization()
  async getAccount(@Authorized('id') id: string) {
    return this.accountService.getAccount(id)
  }

  @Patch('change-email')
  @Authorization()
  async changeEmail(@Authorized() user: User, @Body() dto: ChangeEmailDto) {
    return this.accountService.changeEmail(user, dto)
  }

  @Patch('change-password')
  @Authorization()
  async changePassword(
    @Authorized() user: User,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.accountService.changePassword(user, dto)
  }
}
