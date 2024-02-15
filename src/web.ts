import { WebPlugin } from '@capacitor/core';

import type { TikiClientPlugin } from './definitions';
import Capture from './Capture/index';
import { Photo } from '@capacitor/camera';


const capture = new Capture();
export class TikiClientWeb extends WebPlugin implements TikiClientPlugin {
  async scan(){
    return capture.scan()
  }
  async publish(images: Photo[]): Promise<void> {
      return capture.publish(images)
  }
}
