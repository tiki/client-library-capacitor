import License from "../src/License"

const license = new License()

const sampleGuardRequest = {
  ptr: "example-ptr",
  uses: [
    {
      usecases: [{ value: "usecase1" }, { value: "usecase2" }],
      destinations: ["destination1", "destination2"],
    },
    {
      usecases: [{ value: "usecase3" }],
      destinations: ["destination3"],
    },
  ],
}

const objectToMatch = {
  success: true,
  reason: "its a test",
}

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(objectToMatch),
  })
) as jest.Mock

describe("Guard/Verify License Method", () => {
  test("returns a promise with a GuardRsp Object", async () => {
    const response = await license.guard(sampleGuardRequest, "token")
    expect(response).toMatchObject(objectToMatch)
  })
})
