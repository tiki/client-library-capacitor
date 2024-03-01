export interface PostLicenseRequest {
  ptr: string
  tags: string[]
  uses: Use[]
  terms: string
  expiry: string
  titleDesc: string
  licenseDesc: string
}

export interface License {
  id: string
  title: Title
  uses: Usecase[]
  terms: string
  timestamp: string
  description: string
  expiry: string
}

export interface Use {
  usecases: Usecase[]
  destinations: string[]
}

export interface Title {
  id: string
  hashedPtr: string
  tags: string[]
  timestamp: string
  description: string
}

export interface Usecase {
  value: string
}

export interface RspLicenses {
  licenses: License[]
  requestId: string
}

export interface PostGuardRequest {
  ptr: string
  uses: Use[]
}

export interface RspGuard {
  success: boolean
  reason: string
}
