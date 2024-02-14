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

  async scan(): Promise<Photo>{
    await this.checkPermissionStatus();

    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    }); 
    return image
  }

  async publish(images: Photo[]) {
    const formData = new FormData();
    images.forEach((image, index) => {
      const file = this.base64StringToFile(image.base64String!, index)
      formData.append(`image_${index}`, file);
    });

    try {
      const headers = new Headers()
      headers.append('Content-Type', 'multipart/form-data')
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

  private base64StringToFile(base64String: string, index: number): File {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob =  new Blob([byteArray], { type: 'application/octet-stream' });
    return new File([blob], `image_${index}`);
}
}
