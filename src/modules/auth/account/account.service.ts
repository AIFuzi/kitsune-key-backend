import { hash, verify } from 'argon2'
import { TOTP } from 'otpauth'

import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import {
  ChangeEmailDto,
  ChangePasswordDto,
  CreateAccountDto,
} from '@/src/modules/auth/account/dto'
import {
  EMAIL_ALREADY_EXISTS,
  EMAIL_EQUAL,
  PASSWORD_SAME_ONE,
  PIN_INCORRECT,
  TOTP_INVALID_PIN,
  USER_ALREADY_EXISTS,
  USER_INVALID_PASSWORD,
} from '@/src/shared/messages'
import { User } from '@prisma/generated/client'
import { UserRoleType } from '@prisma/generated/enums'

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

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

  async getAccount(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
        hostVefificationId: true,
      },
    })
  }

  async changeEmail(user: User, dto: ChangeEmailDto) {
    const { email, pin } = dto

    if (user.isTotpEnabled) {
      if (!pin) {
        return { message: [PIN_INCORRECT] }
      }

      if (this.validateTotp(user, pin) === null) {
        throw new BadRequestException(TOTP_INVALID_PIN)
      }
    }

    if (user.email === email) {
      throw new ConflictException(EMAIL_EQUAL)
    }

    const isEmailExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })
    if (isEmailExist) {
      throw new ConflictException(EMAIL_ALREADY_EXISTS)
    }

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        email,
      },
    })

    return true
  }

  async changePassword(user: User, dto: ChangePasswordDto) {
    const { oldPassword, newPassword, pin } = dto

    if (user.isTotpEnabled) {
      if (!pin) {
        return { message: [PIN_INCORRECT] }
      }

      if (this.validateTotp(user, pin) === null) {
        throw new BadRequestException(TOTP_INVALID_PIN)
      }
    }

    if (newPassword === oldPassword) {
      throw new BadRequestException(PASSWORD_SAME_ONE)
    }

    const isValidPassword = await verify(user.password, oldPassword)
    if (!isValidPassword) {
      throw new BadRequestException(USER_INVALID_PASSWORD)
    }

    const newPasswordHash = await hash(newPassword)

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPasswordHash,
      },
    })

    return true
  }

  private validateTotp(user: User, pin: string) {
    const totp = new TOTP({
      label: `${user.email}`,
      digits: 6,
      secret: user.totpSecret,
      algorithm: 'SHA1',
      issuer: this.configService.getOrThrow<string>('TOTP_ISSUER'),
    })

    return totp.validate({ token: pin })
  }
}
