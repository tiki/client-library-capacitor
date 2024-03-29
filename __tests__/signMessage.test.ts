import Utils from "../src/utils";
import KeyService from "../src/key";

describe('Sign Message Unit test', () => {
    test('It should return a string', async () => {
    const keyService = new KeyService()
    const key = await keyService.generateKey()
    const signedMessage = await Utils.signMessage('test message string', key.privateKey)
    expect(signedMessage).toBeDefined()
    expect(signedMessage).toBeTruthy()
    expect((typeof signedMessage ) === 'string').toBe(true)
    })
})