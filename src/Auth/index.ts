import { sha3_256 } from 'js-sha3';


export default class Auth {
  constructor() {}

  private sha3 = sha3_256

  private crypto: SubtleCrypto = window.crypto.subtle;


  async getToken(
    providerId: string,
    pubKey: string,
    token: string,
  ): Promise<String | undefined> {
    const url = 'https://account.mytiki.com/api/latest/auth/token';
    const data = {
      grant_type: 'client_credentials',
      client_id: `provider:${providerId}`,
      client_secret: pubKey,
      scope: 'account:provider trail publish',
      expires: '600',
    };

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', `Bearer ${token}`);

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
      return access_token;
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
        hash: 'SHA-256',
      },
      true,
      ['sign', 'verify'],
    );
    return keypair;
  }

  async address(keyPair: CryptoKeyPair): Promise<ArrayBuffer> {
    const buffer = await this.exportKeyPairToBuffer(keyPair);
    const digest = this.sha3.digest(buffer)
    return new Uint8Array(digest);
  }

  async registerAddress(
    providerId: string,
    pubKey: string,
    userId: string,
    token: string,
  ): Promise<void> {


    const accessToken = await this.getToken(providerId, pubKey, token);
    console.log('accessToken', accessToken);

    if (!accessToken) {
      console.error('Error generating accessToken');
      return;
    }


    const keyPair = await this.generateKey();
    console.log('keyPair', keyPair);

    if (!keyPair) {
      console.error('Error generating key pair');
      return;
    }

    const address = await this.address(keyPair);

    if (!address) {
      console.error('Error generating address');
      return;
    }

    const signature = await this.signMessage(
      userId + '.' + address,
      keyPair.privateKey,
    );
    console.log('signature', signature);
    if (!signature) {
      console.error('Error generating signature');
      return;
    }

    const publicKey = this.base64Encode(
      new Uint8Array(await this.exportKeyPairToBuffer(keyPair)),
    );
    console.log('publicKey', publicKey);

    const url = `https://account.mytiki.com/api/latest/provider/${providerId}/user`;

    console.log('address', this.base64Encode(new Uint8Array(address)));

    const bodyData = new URLSearchParams({
      id: userId,
      address: this.base64Encode(new Uint8Array(address)),
      pubKey: publicKey,
      signature: signature,
    });

    const headers = new Headers();
    headers.append('accept', 'application/json');
    headers.append('authorization', 'Bearer ' + accessToken);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: bodyData,
      });

      if (response.ok) {
        console.log('User registration successful');
      } else {
        console.error(
          'Error registering user. HTTP status: ' + response.status,
        );
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
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

  private base64Encode = (bytes: Uint8Array): string =>
    btoa(
      bytes.reduce((acc, current) => acc + String.fromCharCode(current), ''),
    );

  private async signMessage(
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
}
