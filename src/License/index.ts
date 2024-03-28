import Utils from "../utils";
import {
  PostGuardRequest,
  PostLicenseRequest,
  RspLicenses,
  RspGuard,
} from "./types/index";
import terms from '../assets/terms.md?raw';

export default class License {
  private baseUrl: string =
    "https://corsproxy.io/?" + encodeURIComponent("https://postman-echo.com");
  private utils = new Utils();

  /**
   * Creates a license to publish data to Tiki.
   * @param {string} token - The address token.
   * @param {PostLicenseRequest} postLicenseRequest - An object containing the main information of the license.
   * @returns {PostLicenseRequest} The saved license object.
   */
  public async create(
    token: string,
    postLicenseRequest: PostLicenseRequest
  ): Promise<PostLicenseRequest> {
    const url = `${this.baseUrl}/${"post"}`;
    debugger;
    return this.utils.handleRequest<PostLicenseRequest>(
      url,
      "POST",
      token,
      postLicenseRequest
    );
  }

  /**
   * Retrieves all licenses created for a given address.
   * @param {string} id - The Pointer Record used to identify the licenses. It should be the User ID.
   * @param {string} token - The address token.
   * @returns {RspLicenses} An object containing an array of licenses and a request ID.
   */
  public async get(id: string, token: string): Promise<RspLicenses> {
    debugger;
    const url = `${this.baseUrl}/${"get"}?id=${id}`;
    return this.utils.handleRequest<RspLicenses>(url, "GET", token);
  }

  /**
   * Verify if a license is valid or not
   * @param {PostGuardRequest} postGuardRequest - An Object containing the pointer record and usecases of a license, the ptr will be use to identify the license
   * @param token - the address token necessary to authenticate the request
   * @returns {RspGuard} - An object containing a boolean and a reason message to confirm the validation or not
   */
  public async guard(
    postGuardRequest: PostGuardRequest,
    token: string
  ): Promise<RspGuard> {
    const url = `${this.baseUrl}/post`;
    return this.utils.handleRequest<RspGuard>(
      url,
      "POST",
      token,
      postGuardRequest
    );
  }

  /**
   * Generate an agreement based on Tiki User Data License Agreement.
   * @param companyName - The Name of the company to be replaced in the UDLA.
   * @param jurisdiction - The current jurisdiction of the company to be replaced in the UDLA.
   * @param tosUrl - An URL to the Terms of Service of the company.
   * @param privacyUrl - An URL to the Privacy Policy of the company.
   * @returns {string} - The  User Data License Agreement with the info that were inputed.
   */
  public terms(
    companyName: string,
    jurisdiction: string,
    tosUrl: string,
    privacyUrl: string
  ): string {
    const modifiedContent = Utils.modifyMarkdownContent(terms, {
      "{{{COMPANY}}}": companyName,
      "{{{JURISDICTION}}": jurisdiction,
      "{{{TOS}}}": tosUrl,
      "{{{POLICY}}}": privacyUrl,
    });
    return modifiedContent
  }
}
