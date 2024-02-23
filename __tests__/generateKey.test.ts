import KeyService from '../src/Key/'

const keyService = new KeyService()

describe('Generate Key Method', () => {
  test('returns a promise with a keyPair object', async () => {
    const generatedKey = await keyService.generateKey()
    expect(generatedKey).toBeDefined()
    expect(generatedKey).toHaveProperty('publicKey')
    expect(generatedKey).toHaveProperty('privateKey')
    expect(generatedKey.publicKey.type).toBe('public')
    expect(generatedKey.privateKey.type).toBe('private')
  })
})