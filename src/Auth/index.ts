import KeyService from '../Key/index'
import Utils from '../utils';

export default class Auth {

  private keyService;
  
  constructor(keyService : KeyService) { 
    this.keyService = keyService
  }

  async getToken(
    providerId: string,
    secret: string,
    token: string,
    scopes: Array<string>,
    address?: string,
  ): Promise<string | undefined> {
    const url = 'https://account.mytiki.com/api/latest/auth/token'

    const data = {
      grant_type: 'client_credentials',
      client_id: address == undefined ? `provider:${providerId}` : `address:${providerId}:${address}`,
      client_secret: secret,
      scope: scopes.join(' '),
      expires: '600',
    }

    const headers = new Headers()
    headers.append('Accept', 'application/json')
    headers.append('Content-Type', 'application/x-www-form-urlencoded')
    headers.append('Authorization', `Bearer ${token}`)

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: headers,
      body: new URLSearchParams(data),
    }
    try {
      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, message: ${response.json()}`)
      }

      const responseData = await response.json()

      const { access_token } = responseData
      return access_token
    } catch (error) {
      throw new Error(`Error fetching token: ${error}`)
    }
  }

  async registerAddress(
    providerId: string,
    pubKey: string,
    userId: string,
    token: string,
  ): Promise<void> {
    const accessToken = await this.getToken(providerId, pubKey, token, ['account:provider'])
    if (!accessToken) throw new Error('Error generating the provider accessToken')

    const keyPair = await this.keyService.generateKey()
    if (!keyPair) throw new Error('Error generating key pair')

    const address = Utils.arrayBufferToBase64Url(
      await this.keyService.address(keyPair),
    )
    if (!address) throw new Error('Error generating address')

    const signature = await Utils.signMessage(
      userId + '.' + address,
      keyPair.privateKey,
    )
    if (!signature) throw new Error('Error generating signature')

    const publicKey = Utils.base64Encode(
      new Uint8Array(await Utils.exportKeyPairToBuffer(keyPair)),
    )

    const url = `https://account.mytiki.com/api/latest/provider/${providerId}/user`
    const bodyData = {
      id: userId,
      address: address,
      pubKey: publicKey,
      signature: signature,
    }

    const headers = new Headers()
    headers.append('accept', 'application/json')
    headers.append('content-type', 'application/json')
    headers.append('authorization', 'Bearer ' + accessToken)
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(bodyData),
    })
    if (response.ok) {
      this.keyService.save(keyPair.publicKey, keyPair.privateKey, `${providerId}.${userId}`)
    } else {
      throw new Error(
        'Error registering user. HTTP status: ' + response.status,
      )
    }
  }
}
