import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { UpdateFavoriteDto } from '@/src/modules/listing/favorite/dto'
import { User } from '@prisma/generated/client'

@Injectable()
export class FavoriteService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateFavorite(user: User, dto: UpdateFavoriteDto) {
    const { listingId } = dto

    const isExist = await this.prismaService.listingFavorite.findFirst({
      where: {
        userId: user.id,
        listingId,
      },
    })
    if (isExist) {
      await this.prismaService.listingFavorite.deleteMany({
        where: {
          userId: user.id,
          listingId,
        },
      })
    } else {
      await this.prismaService.listingFavorite.create({
        data: {
          userId: user.id,
          listingId,
        },
      })
    }

    return true
  }

  async getAll(user: User) {
    return this.prismaService.listingFavorite.findMany({
      where: {
        userId: user.id,
      },
      include: {
        listing: {
          select: {
            id: true,
            imageUrl: true,
            title: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
