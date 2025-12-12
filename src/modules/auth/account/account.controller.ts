import { Body, Controller, Get, Post } from '@nestjs/common'
import { CreateAccountDto } from '@/src/modules/auth/account/dto'

import { AccountService } from './account.service'

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  me() {
    return this.accountService.me()
  }

  @Post('create')
  async create(@Body() dto: CreateAccountDto) {
    return await this.accountService.create(dto)
  }
}
