export default class Auth {
  constructor() {}
  private crypto: SubtleCrypto = window.crypto.subtle;

  async getToken(providerId:string, pubKey: string, token: string): Promise<String | undefined> {
    const url = 'https://account.mytiki.com/api/latest/auth/token';
    const data = {
      grant_type: 'client_credentials',
      client_id: `provider:${providerId}`,
      client_secret: pubKey,
      scope: 'account:provider trail publish',
      expires: '600',
    };

    
    const headers = new Headers()
    headers.append('Accept', 'application/json')
    headers.append('Content-Type', 'application/x-www-form-urlencoded')
    headers.append('Authorization', `Bearer ${token}`)

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: headers,
      body: new URLSearchParams(data),
    };
    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Handle the response, e.g., extract the token
      const { access_token } = responseData;
      console.log('Received Access Token:', access_token);
      return access_token
    } catch (error) {
      // Handle errors
      console.error('Error fetching token:', error);
    }
  }

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
