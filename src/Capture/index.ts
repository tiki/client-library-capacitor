import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { Photo } from "@capacitor/camera";

export default class Capture {
  constructor() {}

  protected permissionStatus: 'denied' | 'allowed' = 'denied';

  private async checkPermissionStatus() {
    const permissions = await Camera.checkPermissions();

    if (permissions.camera === 'denied' || permissions.photos === 'denied') {
      this.permissionStatus = 'denied';
      return await Camera.requestPermissions();
    }
    
    return this.permissionStatus = 'allowed'
  }

  async camera(): Promise<Photo>{
    await this.checkPermissionStatus();

    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    console.log(image)
    return image
  }

  async publish(images: Photo[]) {
    const formData = new FormData();
    images.forEach((image, index) => {

      formData.append(`image_${index}`, image.base64String!);
    });

    try {
      const headers = new Headers()
      const response = await fetch('https://postman-echo.com/post', {
        method: 'POST',
        body: formData,
        headers: headers
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Upload successful. Response:', responseData);
      } else {
        console.error('Error uploading files. Status:', response.status);
      }
    } catch (error) {
      console.error('Error uploading files:');
    }
  }
}
