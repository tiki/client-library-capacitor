import Capture from "../src/Capture";

const capture = new Capture()


describe('Scan Method from Capture Class', () => {
    test('returns a string', async () => {
      const photo = await capture.scan()
      expect(photo).toBeDefined()
      expect(photo).toBeTruthy()
    })
})