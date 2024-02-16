import type { Photo } from "@capacitor/camera";
export interface TikiClientPlugin {
  scan(): Promise<Photo>;
  publish(images: Photo[]): Promise<void>;
  generateKey(): Promise<CryptoKeyPair>;
  address(keyPair: CryptoKeyPair): Promise<ArrayBuffer>;
  getToken(providerId: string, pubKey: string, token: string): Promise<String | undefined>;
}
