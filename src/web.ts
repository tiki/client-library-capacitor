import { WebPlugin } from '@capacitor/core';
import { TikiClientPlugin } from './definitions';

export class TikiClientWeb extends WebPlugin implements TikiClientPlugin {
  constructor() {
    super({
      name: 'TikiClient',
      platforms: ['web'],
    });
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}

const TikiClient = new TikiClientWeb();

export { TikiClient };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(TikiClient);
