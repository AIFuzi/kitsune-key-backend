import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UpdateProfileInfoDto } from '@/src/modules/profile/dto'
import { Authorization, Authorized } from '@/src/shared/decorators'
import { User } from '@prisma/generated/client'

import { ProfileService } from './profile.service'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.profileService.getProfile(id)
  }

  @Patch('avatar/update')
  @Authorization()
  @UseInterceptors(FileInterceptor('avatarUrl'))
  async updateAvatar(
    @Authorized() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.updateAvatar(user, file)
  }

  @Delete('avatar/remove')
  @Authorization()
  async removeAvatar(@Authorized() user: User) {
    return this.profileService.removeAvatar(user)
  }

  @Patch('update')
  @Authorization()
  async updateProfile(
    @Authorized() user: User,
    @Body() dto: UpdateProfileInfoDto,
  ) {
    return this.profileService.updateProfileInfo(user, dto)
  }
}
