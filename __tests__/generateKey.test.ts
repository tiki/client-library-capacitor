import KeyService from "../src/Key";


describe('Key Service generate Key process', () => {
    const keyService = new KeyService()
    test('generates a key', async () => {
      const key = await keyService.generateKey()
      expect(key).toBeTruthy()
      expect(key).toBeDefined()
    })
})