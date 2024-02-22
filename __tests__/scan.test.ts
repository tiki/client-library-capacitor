import TikiClient  from '../src/index';
import { type Photo } from '@capacitor/camera';

const photo: Photo = {base64String: 'base64String', path: 'image/png', format: 'png', saved: true}
const tikiClient = new TikiClient()
describe('Take Photo mock function', () => {
  test('returns a promise resolving to a Photo object',  async () => {
    expect(await tikiClient.Capture.scan()).toMatchObject(photo)
  });
});
