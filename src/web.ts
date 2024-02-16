import { WebPlugin } from '@capacitor/core';

import type { TikiClientPlugin } from './definitions';
import Capture from './Capture/index';
import { Photo } from '@capacitor/camera';
import Auth from './Auth/index'


const capture = new Capture();
const auth = new Auth()
export class TikiClientWeb extends WebPlugin implements TikiClientPlugin {
  async scan(){
    return capture.scan()
  }
  async publish(images: Photo[]): Promise<void> {
      return capture.publish(images)
  }
  generateKey(): Promise<CryptoKeyPair> {
      return auth.generateKey()
  }
  address(keyPair: CryptoKeyPair): Promise<ArrayBuffer> {
      return auth.address(keyPair)
  }
  getToken(providerId: string, pubKey: string, token: string): Promise<String | undefined> {
      return auth.getToken(providerId, pubKey, token)
  }
}
