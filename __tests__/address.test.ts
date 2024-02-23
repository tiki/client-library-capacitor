import KeyService from '../src/Key/index'
import KeyRepository from '../src/Key/repository'

const keyService = new KeyService()
const keyRepository = new KeyRepository()

describe('Address Method', () => {
  test('returns a promise with the digest of the keyPair', async () => {
    const generatedKey = await keyRepository.generateKey()
    const digest = await keyService.address(generatedKey)
    expect(digest).toBeDefined()
    expect(digest instanceof Uint8Array).toBe(true)
    expect(digest.byteLength).toBe(32)
  })
})