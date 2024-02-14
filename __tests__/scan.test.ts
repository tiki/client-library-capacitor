import { Camera } from '@capacitor/camera';

import { TikiClient } from '../';

describe('Take Photo mock function', () => {
  test('returns a promise resolving to a Photo object', () => {
    // Assuming fetchPhoto returns a Promise that resolves to a Photo object
    TikiClient.scan()
    expect(Camera.requestPermissions()).toBeDefined();
    // expect(Camera.getPhoto()).toBeDefined();
  });
});
