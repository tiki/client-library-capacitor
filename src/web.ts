import { WebPlugin } from '@capacitor/core';

import type { TikiClientPlugin } from './definitions';

export class TikiClientWeb extends WebPlugin implements TikiClientPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
