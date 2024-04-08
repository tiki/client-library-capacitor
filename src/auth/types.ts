/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface RegisterAddressRsp {
    id: string,
    created: string,
    address: string,
    pubKey: string
}