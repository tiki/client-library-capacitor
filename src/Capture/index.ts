import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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

  async camera(){
    await this.checkPermissionStatus();

    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });

    console.log(image)
    return image
  }

}
