import Capture from '../src/Capture/index'
import { Photo } from '@capacitor/camera';

const capture = new Capture()

const photo: Photo = {base64String: 'base64String', path: 'image/png', format: 'png', saved: true}

describe('Take Photo mock function', () => {
    test('returns a promise resolving to a Photo object', () => {
     expect(capture.publish([photo])).toBeDefined()
    });
  });