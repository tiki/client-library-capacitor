import { sha3_256 } from 'js-sha3'
import Utils from '../utils'
import KeyRepository from './repository'

export default class KeyService {

  private repository: KeyRepository = new KeyRepository()

  public save(publicKey: CryptoKey, privateKey: CryptoKey, userId: string) {
    this.repository.save(publicKey, privateKey, userId)
  }

  public get(){
    return this.repository.list()
  }

  async address(keyPair: CryptoKeyPair): Promise<ArrayBuffer> {
    const buffer = await Utils.exportKeyPairToBuffer(keyPair)
    const digest = sha3_256.digest(buffer)
    return new Uint8Array(digest)
  }

  async generateKey(): Promise<CryptoKeyPair> {
    const keypair: CryptoKeyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256',
      },
      false,
      ['sign', 'verify'],
    )
    return keypair
  }

}
