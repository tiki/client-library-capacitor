import KeyService from "../src/Key";


describe('Key Service Save Key process', () => {
    const keyService = new KeyService()
    test('saves a key into a indexedDB', async () => {
      const key = await keyService.generateKey()
      expect(key).toBeTruthy()
      expect(key).toBeDefined()
      expect(keyService.save(key.publicKey, key.privateKey, 'testKey')).resolves
    })
})