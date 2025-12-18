import { randomBytes } from 'node:crypto'
import { encode } from 'hi-base32'
import { Secret, TOTP } from 'otpauth'
import * as QRCode from 'qrcode'

import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { EnableTotpDto } from '@/src/modules/auth/totp/dto'
import { TOTP_INVALID_PIN } from '@/src/shared/messages'
import { User } from '@prisma/generated/client'

@Injectable()
export class TotpService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async generate2FA(user: User) {
    const secret = encode(randomBytes(15)).replace(/=/g, '').substring(0, 24)

    const totp = new TOTP({
      issuer: this.configService.get<string>('TOTP_ISSUER'),
      secret: Secret.fromBase32(secret),
      algorithm: 'SHA1',
      digits: 6,
      label: `${user.email}`,
    })

    const otpauthUrl = totp.toString()
    const qrcodeUrl = await QRCode.toDataURL(otpauthUrl)

    return { qrcodeUrl, secret }
  }

  async enable2FA(user: User, dto: EnableTotpDto) {
    const { secret, pin } = dto

    const totp = new TOTP({
      issuer: this.configService.get<string>('TOTP_ISSUER'),
      secret: Secret.fromBase32(secret),
      algorithm: 'SHA1',
      digits: 6,
      label: `${user.email}`,
    })

    const delta = totp.validate({ token: pin })
    if (delta === null) {
      throw new BadRequestException(TOTP_INVALID_PIN)
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        isTotpEnabled: true,
        totpSecret: secret,
      },
    })

    return true
  }

  async disable2FA(user: User) {
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        isTotpEnabled: false,
        totpSecret: null,
      },
    })

    return true
  }
}
