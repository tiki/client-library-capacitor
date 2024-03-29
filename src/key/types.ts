/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface SavedKey {
    id: number
    value: KeyValue
}

interface KeyValue {
    publicKey: CryptoKey,
    privateKey: CryptoKey,
    name: string,
    spki: ArrayBuffer,
}