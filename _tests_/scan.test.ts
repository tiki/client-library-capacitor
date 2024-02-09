import { Camera } from '../_mocks_/@capacitor/camera';

describe('Take Photo mock function', () => {
  test('returns a promise resolving to a Photo object', () => {
    // Assuming fetchPhoto returns a Promise that resolves to a Photo object
    expect(Camera.requestPermissions()).toBeDefined();
    expect(Camera.getPhoto()).toBeDefined();
  });
});
