import type { Photo } from "@capacitor/camera";
export interface TikiClientPlugin {
  scan(): Promise<Photo>;
  publish(images: Photo[]): Promise<void>;
  getToken(providerId: string, pubKey: string, token: string): Promise<String | undefined>;
  registerAddress(
    providerId: string,
    pubKey: string,
    userId: string,
    token: string,
  ): Promise<void>
}
