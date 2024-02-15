import Auth from '../src/Auth/index'

const auth = new Auth()

describe('Generate Key Method', () => {
    test('returns a promise with a keyPair object', async () => {
      const generatedKey = await auth.generateKey()
      console.log(generatedKey)
      expect(generatedKey).toBeDefined();
      expect(generatedKey).toHaveProperty('publicKey');
      expect(generatedKey).toHaveProperty('privateKey');
      expect(generatedKey.publicKey.type).toBe('public');
      expect(generatedKey.privateKey.type).toBe('private');
    });
  });