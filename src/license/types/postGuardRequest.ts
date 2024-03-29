/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { Use } from '.'

export interface PostGuardRequest {
  ptr: string
  uses: Use[]
}
