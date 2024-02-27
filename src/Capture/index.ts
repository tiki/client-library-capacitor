import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import type { Photo } from "@capacitor/camera";
import Utils from "../utils";

export default class Capture {
  /**
   * Uses Capacitor to capture a picture with the device's camera or select a photo from the gallery.
   * @returns {Photo} with the image saved as base64-encoded string representing the photo.
   */
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
  /**
   * Publish the Photo to Tiki
   * @param {Photo[]} images an array of photos to be published
   */
  async publish(images: Photo[]) {
    const formData = new FormData();
    images.forEach((image, index) => {
      const file = Utils.base64StringToFile(
        image.base64String!,
        `image_${index}`
      );
      formData.append(`image_${index}`, file);
    });

    try {
      const headers = new Headers();
      headers.append("Content-Type", "multipart/form-data");
      const response = await fetch("https://postman-echo.com/post", {
        method: "POST",
        body: formData,
        headers: headers,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Upload successful. Response:", responseData);
      } else {
        throw new Error(`Error uploading files. Status:, ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error uploading files: ${error}`);
    }
  }
}
