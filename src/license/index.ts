/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import Utils from "../utils";
import {
  PostLicenseRequest,
  RspGuard,
} from "./types/index";
import terms from '../assets/terms.md?raw';

/**
 * License provides functionality for creating and verifying licenses for publishing data to Tiki.
 */
export default class License {
  private baseUrl: string = "https://trail.mytiki.com"

  /**
   * Creates a license to publish data to Tiki.
   * 
   * @param token - The address token.
   * @param postLicenseRequest - An object containing the main information of the license.
   * @returns The saved license object.
   */
  public async create(
    postLicenseRequest: PostLicenseRequest
  ): Promise<PostLicenseRequest> {
    const url = `${this.baseUrl}/license/create`;
    return Utils.handleRequest<PostLicenseRequest>(
      url,
      "POST",
      postLicenseRequest
    );
  }

  /**
   * Verifies if a license is valid.
   * 
   * @param token - The address token necessary to authenticate the request.
   * @returns An object containing a boolean and a reason message to confirm the validation or not.
   */
  public async verify(
  ): Promise<RspGuard> {
    const url = `${this.baseUrl}/license/verify`;
    return Utils.handleRequest<RspGuard>(
      url,
      "POST",
    );
  }

  /** 
   * Generates an agreement based on Tiki User Data License Agreement.
   * @param companyName - The name of the company to be replaced in the UDLA.
   * @param jurisdiction - The current jurisdiction of the company to be replaced in the UDLA.
   * @param tosUrl - An URL to the Terms of Service of the company.
   * @param privacyUrl - An URL to the Privacy Policy of the company.
   * @returns The User Data License Agreement with the provided information.
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
