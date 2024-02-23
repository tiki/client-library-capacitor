import License from "../src/License"

const license = new License()

const samplePostLicenseRequest = {
  ptr: "example-ptr",
  tags: ["tag1", "tag2"],
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
  terms: "Sample terms",
  expiry: "2024-12-31",
  titleDesc: "Title description",
  licenseDesc: "License description",
}

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(samplePostLicenseRequest),
  })
) as jest.Mock

describe("Create License Method", () => {
  test("returns a promise with a License Object", async () => {
    const response = await license.create("token", samplePostLicenseRequest)
    expect(response).toMatchObject(samplePostLicenseRequest)
  })
})
