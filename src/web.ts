import { WebPlugin } from '@capacitor/core';

import type { TikiClientPlugin } from './definitions';
import Capture from './Capture/index';


const capture = new Capture();
export class TikiClientWeb extends WebPlugin implements TikiClientPlugin {
  async scan(){
    return capture.camera()
  }
}
