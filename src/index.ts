import { registerPlugin } from '@capacitor/core';

import type { TikiClientPlugin } from './definitions';

const TikiClient = registerPlugin<TikiClientPlugin>('TikiClient', {
  web: () => import('./web').then(m => new m.TikiClientWeb()),
});

export * from './definitions';
export { TikiClient };
