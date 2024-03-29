

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