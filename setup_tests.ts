import { Crypto } from "@peculiar/webcrypto"
const cryptoModule = new Crypto()

import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

Object.defineProperty(window, 'crypto', {
  get() {
    return cryptoModule
  }
})