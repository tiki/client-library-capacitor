import { TikiClient } from '../';
import { type Photo } from '@capacitor/camera';

const photo: Photo = {base64String: 'base64String', path: 'image/png', format: 'png', saved: true}

describe('Take Photo mock function', () => {
  test('returns a promise resolving to a Photo object',  async () => {
    expect(await TikiClient.scan()).toMatchObject(photo)
  });
});
