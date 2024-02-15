export default class Auth {
  constructor() {}
  private crypto: SubtleCrypto = window.crypto.subtle;

  async generateKey(): Promise<CryptoKeyPair> {
    const keypair: CryptoKeyPair = await this.crypto.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-384',
      },
      true,
      ['sign', 'verify'],
    );
    return keypair;
  }

  async address(keyPair: CryptoKeyPair): Promise<ArrayBuffer> {
    const buffer = await this.exportKeyPairToBuffer(keyPair);
    const digest = await this.crypto.digest('SHA-384', buffer);
    return digest;
  }

  private async exportKeyPairToBuffer(
    keyPair: CryptoKeyPair,
  ): Promise<ArrayBuffer> {
    const publicKeyExported = await this.crypto.exportKey(
      'spki',
      keyPair.publicKey,
    );
    const buffer = new Uint8Array(publicKeyExported.byteLength);
    buffer.set(new Uint8Array(publicKeyExported), 0);
    return buffer.buffer;
  }
}
