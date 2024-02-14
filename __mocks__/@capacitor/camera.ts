import type { CameraPlugin, CameraResultType, CameraSource } from "@capacitor/camera";

export const Camera: CameraPlugin = jest.createMockFromModule('@capacitor/camera')

export const mockCameraResultType: CameraResultType = jest.createMockFromModule('@capacitor/camera') as CameraResultType

export const mockCameraSource: CameraSource = jest.createMockFromModule('@capacitor/camera') as CameraSource


Camera.requestPermissions = () => new Promise((resolve) => resolve({
  camera: 'granted',
  photos: 'granted'
}));
  
Camera.getPhoto = () => new Promise((resolve) => resolve({ 
  base64String: 'base64String',
  path: 'image/png',
  format: 'png',
  saved: true 
}));

Camera.checkPermissions = () => new Promise((resolve) => resolve({ 
  camera: 'granted',
  photos: 'granted'
}));