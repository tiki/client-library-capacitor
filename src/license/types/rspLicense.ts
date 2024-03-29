/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { License } from "."

export interface RspLicenses {
  licenses: License[]
  requestId: string
}