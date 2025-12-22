import * as sharp from 'sharp'
import { v4 } from 'uuid'

import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { S3Service } from '@/src/modules/libs/s3/s3.service'
import { UpdateProfileInfoDto } from '@/src/modules/profile/dto'
import { User } from '@prisma/generated/client'

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async getProfile(id: string) {
    return this.prismaService.profileInfo.findUnique({
      where: {
        userId: id,
      },
    })
  }

  async updateAvatar(user: User, file: Express.Multer.File) {
    const userProfile = await this.prismaService.profileInfo.findUnique({
      where: { userId: user.id },
    })

    if (userProfile.avatarUrl) {
      await this.s3Service.remove(userProfile.avatarUrl)
      await this.prismaService.profileInfo.update({
        where: {
          userId: user.id,
        },
        data: {
          avatarUrl: null,
        },
      })
    }

    const processedBuffer = await sharp(file.buffer)
      .resize(512, 512)
      .avif()
      .toBuffer()

    const newFileName = `${v4()}.avif`

    await this.s3Service.upload(processedBuffer, newFileName, file.mimetype)

    await this.prismaService.profileInfo.update({
      where: {
        userId: user.id,
      },
      data: {
        avatarUrl: newFileName,
      },
    })

    return true
  }

  async removeAvatar(user: User) {
    const userProfile = await this.prismaService.profileInfo.findUnique({
      where: { userId: user.id },
    })

    if (!userProfile.avatarUrl) {
      return { message: ['Profile avatar is null'] }
    }

    await this.s3Service.remove(userProfile.avatarUrl)
    await this.prismaService.profileInfo.update({
      where: {
        userId: user.id,
      },
      data: {
        avatarUrl: null,
      },
    })

    return true
  }

  async updateProfileInfo(user: User, dto: UpdateProfileInfoDto) {
    const { liveIn, birthday, workingIn, name, aboutMe } = dto

    return this.prismaService.profileInfo.update({
      where: {
        userId: user.id,
      },
      data: {
        liveIn,
        birthday,
        workingIn,
        name,
        aboutMe,
      },
    })
  }
}
