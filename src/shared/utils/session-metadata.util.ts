import type { Request } from 'express'
import { lookup } from 'geoip-lite'

import { IS_DEV_ENV } from '@/src/shared/utils/is-dev.util'
import DeviceDetector = require('device-detector-js')
import * as countries from 'i18n-iso-countries'

import { SessionMetadata } from '@/src/shared/types'

export function getSessionMetadata(
  req: Request,
  userAgent: string,
): SessionMetadata {
  const ip = IS_DEV_ENV
    ? '180.228.172.138'
    : Array.isArray(req.headers['cf-connection-ip'])
      ? req.headers['cf-connection-ip'][0]
      : req.headers['cf-connection-ip'] ||
        (typeof req.headers['x-forwarded-for'] === 'string'
          ? req.headers['x-forwarded-for'].split(',')[0]
          : req.ip)

  const location = lookup(ip)
  const device = new DeviceDetector().parse(userAgent)

  const country = countries.getName(location.country, 'en') || 'Unknown'

  return {
    location: {
      country,
      city: location.city,
      latitude: location.ll[0] || 0,
      longitude: location.ll[1] || 0,
    },
    device: {
      browser: device.client?.name ?? 'Unknown',
      os: device.os?.name ?? 'Unknown',
      type: device.device?.type ?? 'Unknown',
    },
    ip,
  }
}
