import { sha3_256 } from 'js-sha3';

export default class KeyService {
  constructor() {}
  private crypto: SubtleCrypto = window.crypto.subtle;
  private sha3 = sha3_256;

  async address(keyPair: CryptoKeyPair): Promise<ArrayBuffer> {
    const buffer = await this.exportKeyPairToBuffer(keyPair);
    const digest = this.sha3.digest(buffer);
    return new Uint8Array(digest);
  }

  async exportKeyPairToBuffer(keyPair: CryptoKeyPair): Promise<ArrayBuffer> {
    const publicKeyExported = await this.crypto.exportKey(
      'spki',
      keyPair.publicKey,
    );
    const buffer = new Uint8Array(publicKeyExported.byteLength);
    buffer.set(new Uint8Array(publicKeyExported), 0);
    return buffer.buffer;
  }

  base64Encode = (bytes: Uint8Array): string =>
    btoa(
      bytes.reduce((acc, current) => acc + String.fromCharCode(current), ''),
    );

  async signMessage(
    message: string,
    privateKey: CryptoKey,
  ): Promise<string | null> {
    try {
      const signature = await crypto.subtle.sign(
        { name: 'RSASSA-PKCS1-v1_5' },
        privateKey,
        new TextEncoder().encode(message),
      );
      return this.base64Encode(new Uint8Array(signature));
    } catch (error) {
      console.error('Error signing message:', error);
      return null;
    }
  }

  arrayBufferToBase64Url(arrayBuffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(arrayBuffer);

    const base64String = btoa(String.fromCharCode(...uint8Array));

    const base64Url = base64String
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return base64Url;
  }
}
