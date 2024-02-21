//import { registerPlugin } from '@capacitor/core';

// import type { TikiClientPlugin } from './definitions';

// const TikiClient = registerPlugin<TikiClientPlugin>('TikiClient', {
//   web: () => import('./web').then(m => new m.TikiClientWeb()),
// });

import Capture from './Capture/index';
import Auth from './Auth/index'


export default class TikiClient{
  Capture = new Capture();
  Auth = new Auth()

  
}

// export * from './definitions';
// export { TikiClient };
