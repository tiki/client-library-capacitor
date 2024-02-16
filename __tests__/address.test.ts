import Auth from '../src/Auth/index'

const auth = new Auth()

describe('Address Method', () => {
    test('returns a promise with the digest of the keyPair', async () => {
      const generatedKey = await auth.generateKey()
      const digest = await auth.address(generatedKey)
      expect(digest).toBeDefined(); 
      expect(digest instanceof ArrayBuffer).toBe(true); 
      expect(digest.byteLength).toBe(48)
    });
  });