import { Body, Controller, Get, Post } from '@nestjs/common'
import { UpdateFavoriteDto } from '@/src/modules/listing/favorite/dto'
import { Authorization, Authorized } from '@/src/shared/decorators'
import { User } from '@prisma/generated/client'

import { FavoriteService } from './favorite.service'

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @Authorization()
  async updateFavorite(
    @Authorized() user: User,
    @Body() dto: UpdateFavoriteDto,
  ) {
    return this.favoriteService.updateFavorite(user, dto)
  }

  @Get()
  @Authorization()
  async getAll(@Authorized() user: User) {
    return this.favoriteService.getAll(user)
  }
}
