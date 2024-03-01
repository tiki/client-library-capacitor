import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import type { Photo } from "@capacitor/camera";
import Utils from "../utils";

export default class Capture {
  /**
   * Uses Capacitor to capture a picture with the device's camera or select a photo from the gallery.
   * @returns {Photo} with the image saved as base64-encoded string representing the photo.
   */
  public async scan(): Promise<Photo> {
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

  /**
   * Publishes the provided photos to Tiki.
   * @param {Photo[]} images - Array of photos to be published, each with the format and base64 string.
   * @param {string} [requestId] - Optional unique identifier for the request.
   * @returns {Promise<string>} A Promise that resolves with the ID of the request.
   */
  public async publish(images: Photo[], requestId: string): Promise<string> {
    const id = requestId ?? window.crypto.randomUUID();

    const apiUrl =
      "https://67vm38cq09.execute-api.us-east-2.amazonaws.com/receipt";

    const headers = new Headers();
    headers.append("Content-Type", "image/jpeg");

    for (const image of images) {
      const body = Utils.base64toBlob(image.base64String!, "image/jpeg");
      const url = `${apiUrl}?id=${id}`;

      const response = await fetch(url, {
        method: "PUT",
        body,
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error uploading files. Status: ${response.status}`);
      }
    }

    return id;
  }
}
