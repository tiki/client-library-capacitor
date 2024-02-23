import { Crypto } from "@peculiar/webcrypto"
const cryptoModule = new Crypto()

Object.defineProperty(window, 'crypto', {
  get() {
    return cryptoModule
  }
})