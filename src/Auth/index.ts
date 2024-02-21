import KeyService from '../Key/index';
import KeyRepository from '../Key/repository';


export default class Auth {
  constructor() {}

  private keyService = new KeyService();
  private keyRepository = new KeyRepository();
  async getToken(
    providerId: string,
    pubKey: string,
    token: string,
  ): Promise<string | undefined> {
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

  async registerAddress(
    providerId: string,
    pubKey: string,
    userId: string,
    token: string,
  ): Promise<void> {
    const accessToken = await this.getToken(providerId, pubKey, token);

    if (!accessToken) {
      console.error('Error generating accessToken');
      return;
    }

    const keyPair = await this.keyRepository.generateKey();

    if (!keyPair) {
      console.error('Error generating key pair');
      return;
    }

    const address = this.keyService.arrayBufferToBase64Url(
      await this.keyService.address(keyPair),
    );

    if (!address) {
      console.error('Error generating address');
      return;
    }

    const signature = await this.keyService.signMessage(
      userId + '.' + address,
      keyPair.privateKey,
    );
    if (!signature) {
      console.error('Error generating signature');
      return;
    }

    const publicKey = this.keyService.base64Encode(
      new Uint8Array(await this.keyService.exportKeyPairToBuffer(keyPair)),
    );

    const url = `https://account.mytiki.com/api/latest/provider/${providerId}/user`;
    const bodyData = {
      id: userId,
      address: address,
      pubKey: publicKey,
      signature: signature,
    };

    const headers = new Headers();
    headers.append('accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('authorization', 'Bearer ' + accessToken);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData),
      });
      if (response.ok) {
        await this.keyRepository.open()
        await this.keyRepository.saveKey(keyPair.publicKey, keyPair.privateKey, 'keys')
        await this.keyRepository.listKeys()
        await this.keyRepository.close()
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
}
