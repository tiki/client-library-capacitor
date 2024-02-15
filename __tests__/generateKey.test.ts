import Auth from '../src/Auth/index'

const auth = new Auth()

let keyPair: CryptoKeyPair; 
describe('Generate Key Method', () => {
    test('returns a promise with a keyPair object', async () => {
      const generatedKey = await auth.generateKey()
      expect(generatedKey).toMatchObject(keyPair)
    });
  });