/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import Utils from "../utils";
import { ReceiptResponse } from "./types";

export default class Capture {
  private publishUrl: string = "https://publish.mytiki.com";

  /**
   * Uses Capacitor to capture a picture with the device's camera or select a photo from the gallery.
   * @returns {string} - the base64 string of the captured/selected image
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
   * Publishes the photos to Tiki.
   * @param {string[]} images - Array of photos to be published in base64 strings.
   * @param {string} token - the address token to authenticate the request to our server.
   * @returns {Promise<string>} A Promise that resolves with the ID of the request or void in case of any error.
   */
  public async publish(images: string[]): Promise<string | void> {
    const id = window.crypto.randomUUID();

    for (const image of images) {
      const body = Utils.base64toBlob(image, "image/jpeg");
      const url = `${this.publishUrl}/receipt/${id}`;

      await Utils.handleRequest(url, "POST", body).catch((error)=>{
        console.error(`Error uploading files. Status: ${error}`);
        return
      })
      
    }

    return id;
  }

  /**
   * Retrieve the structured data extracted from the processed receipt image.
   * 
   * This method fetches the result of the receipt image processing from the server, considering all the published images.
   * 
   * @param {string} receiptId - The unique identifier for the receipt obtained from the {@link publish} method.
   * @param {string} token - The authentication token required to authorize the request to the server.
   * @returns {Promise<ReceiptResponse[]>} A Promise that resolves with an array of {@link ReceiptResponse} objects,
   * each containing the structured data extracted from an image of the receipt.
   */
  public async receipt(receiptId: string
    ): Promise<ReceiptResponse[]>{
    const url = `${this.publishUrl}/receipt/${receiptId}`
    return await Utils.handleRequest(url, "GET")
  }
}
