import KeyService from '../src/key/index'


const keyService = new KeyService()

describe('Address Method', () => {
  test('returns a promise with the digest of the keyPair', async () => {
    const generatedKey = await keyService.generateKey()
    const digest = await keyService.address(generatedKey)
    expect(digest).toBeDefined()
    expect(digest instanceof Uint8Array).toBe(true)
    expect(digest.byteLength).toBe(32)
  })
})