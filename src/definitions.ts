import type { Photo } from "@capacitor/camera";
export interface TikiClientPlugin {
  scan(): Promise<Photo>;
}
