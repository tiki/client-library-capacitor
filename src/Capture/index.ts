import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import type { Photo } from "@capacitor/camera";
import Utils from "../utils";

export default class Capture {
  async scan(): Promise<Photo> {
    const permissions = await Camera.checkPermissions();

    if (permissions.camera === "denied" || permissions.photos === "denied") {
      await Camera.requestPermissions();
    }

    return await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });
  }

  async publish(image: Photo) {
    const body = Utils.base64toBlob(image.base64String!, "image/jpeg");

    const headers = new Headers();
    headers.append("Content-Type", "image/jpeg");
    const response = await fetch(
      "https://67vm38cq09.execute-api.us-east-2.amazonaws.com/test",
      {
        method: "PUT",
        body,
        headers: headers,
      }
    );
    if (!response.ok)
      throw new Error(`Error uploading files. Status:, ${response.status}`);

    return response
  }
}
