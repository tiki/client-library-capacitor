import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import Utils from "../utils";

export default class Capture {
  private publishUrl: string = "https://67vm38cq09.execute-api.us-east-2.amazonaws.com/receipt";

  /**
   * Uses Capacitor to capture a picture with the device's camera or select a photo from the gallery.
   * @returns {string} with the image saved as base64-encoded string representing the photo.
   */
  public async scan(): Promise<string | undefined> {
    const permissions = await Camera.checkPermissions();

    if (permissions.camera === "denied" || permissions.photos === "denied") {
      await Camera.requestPermissions();
    }

    const photo = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    return photo.base64String
  }

  /**
   * Publishes the provided photos to Tiki.
   * @param {Photo[]} images - Array of photos to be published, each with the format and base64 string.
   * @param {string} [requestId] - Optional unique identifier for the request.
   * @returns {Promise<string>} A Promise that resolves with the ID of the request.
   */
  public async publish(images: string[], token: string): Promise<string | void> {
    const id = window.crypto.randomUUID();

    const headers = new Headers();
    headers.append("Content-Type", "image/jpeg");
    headers.append("Authorization", "Bearer " + token);

    for (const image of images) {
      const body = Utils.base64toBlob(image, "image/jpeg");
      const url = `${this.publishUrl}/id/${id}`;

      const response = await fetch(url, {
        method: "PUT",
        body,
        headers,
      });

      if (!response.ok) {
        console.error(`Error uploading files. Status: ${response.status}`);
        return
      }
    }

    return id;
  }
}
