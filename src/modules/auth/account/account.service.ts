import { hash } from 'argon2'

import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { CreateAccountDto } from '@/src/modules/auth/account/dto'
import { USER_ALREADY_EXISTS } from '@/src/shared/messages'
import { UserRoleType } from '@prisma/generated/enums'

@Injectable()
export class AccountService {
  constructor(private readonly prismaService: PrismaService) {}

  me() {
    return { message: 'me' }
  }

  async create(dto: CreateAccountDto) {
    const { email, password, name, aboutMe, birthday, userRole } = dto

    const isExistUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })
    if (isExistUser) {
      throw new ConflictException(USER_ALREADY_EXISTS)
    }

    const hashedPassword = await hash(password)

    return this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        profileInfo: {
          create: {
            name,
            aboutMe,
            birthday,
          },
        },
        userRole: {
          create: {
            roleType: userRole ? userRole : UserRoleType.USER,
          },
        },
      },
      include: {
        profileInfo: true,
        userRole: true,
      },
    })
  }
}
