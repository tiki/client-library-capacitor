import License from "../src/License"

const license = new License()

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(),
  })
) as jest.Mock

describe("Get License Method", () => {
  test("returns a promise with a RspLicense Object", async () => {
    const response = await license.get('id', 'token')
    expect(response).toBe(undefined)
  })
})
