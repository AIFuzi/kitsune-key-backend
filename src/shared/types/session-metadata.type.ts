export interface LocationType {
  country: string
  city: string
  latitude: number
  longitude: number
}

export interface DeviceType {
  os: string
  browser: string
  type: string
}

export interface SessionMetadata {
  location: LocationType
  device: DeviceType
  ip: string
}
