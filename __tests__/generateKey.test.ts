import KeyRepository from '../src/Key/repository'

const keyRepository = new KeyRepository()

describe('Generate Key Method', () => {
  test('returns a promise with a keyPair object', async () => {
    const generatedKey = await keyRepository.generateKey()
    expect(generatedKey).toBeDefined()
    expect(generatedKey).toHaveProperty('publicKey')
    expect(generatedKey).toHaveProperty('privateKey')
    expect(generatedKey.publicKey.type).toBe('public')
    expect(generatedKey.privateKey.type).toBe('private')
  })
})