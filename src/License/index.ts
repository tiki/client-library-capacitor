import Utils from "../utils";


export default class License {
  private baseUrl: string = 'https://corsproxy.io/?' + encodeURIComponent('https://postman-echo.com');
  private utils = new Utils();


  public async create(
    token: string,
    postLicenseRequest: PostLicenseRequest
  ): Promise<License> {
    console.log(token, postLicenseRequest)
    const url = `${this.baseUrl}/${"post"}`;
    console.log
    return this.utils.handleRequest<License>(url, "POST", token, postLicenseRequest);
  }

  public async get(id: string, token: string): Promise<RspLicenses> {
    const url = `${this.baseUrl}/${"get"}?id=${id}`;
    return this.utils.handleRequest<RspLicenses>(url, "GET", token);
  }
}
