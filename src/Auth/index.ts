import KeyService from "../Key/index";
import Utils from "../utils";
import { RegisterAddressRsp } from "./types";

export default class Auth {
  private keyService: KeyService;
  private tokenUrl: string = "https://account.mytiki.com/api/latest/auth/token";
  private registerAddressUrl: string =
    "https://account.mytiki.com/api/latest/provider";

  constructor(keyService: KeyService) {
    this.keyService = keyService;
  }

  /**
   * Retrieves a JWT Access Token from the Tiki backend.
   * @param {string} providerId - The ID of the provider created for this operation.
   * @param {string} secret - The client secret for this operation, generated from the signature of the publicKey. Must be provided in base64 encoding.
   * @param {string[]} scopes - The scopes required for the operation to be executed.
   * @param {string} [address] - Optional. The address used to request the addressId instead of the providerId.
   * @returns {string} A JWT Access Token.
   */
  async getToken(
    providerId: string,
    secret: string,
    scopes: Array<string>,
    address?: string
  ): Promise<string | undefined> {
    const data = {
      grant_type: "client_credentials",
      client_id:
        address == undefined
          ? `provider:${providerId}`
          : `addr:${providerId}:${address}`,
      client_secret: secret,
      scope: scopes.join(" "),
      expires: "600",
    };

    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const requestOptions: RequestInit = {
      method: "POST",
      headers: headers,
      body: new URLSearchParams(data),
    };
    try {
      const response = await fetch(this.tokenUrl, requestOptions);

      if (!response.ok) {
        console.error(
          `HTTP error! Status: ${response.status}, message: ${response.json()}`
        );
        return
      }

      const responseData = await response.json();

      const { access_token } = responseData;
      return access_token;
    } catch (error) {
      console.error(`Error fetching token: ${error}`);
      return
    }
  }

  /**
   * Creates a new address for publishing data.
   * @param {string} providerId - The ID of the provider to be associated with the new address.
   * @param {string} pubKey - The public key of the provider.
   * @param {string} userId - The identifier of the address or user to be created.
   * @returns {string | void} The address to be used for sending data or void in case of any error
   */
  async registerAddress(
    providerId: string,
    pubKey: string,
    userId: string
  ): Promise<string | void> {
    const accessToken = await this.getToken(providerId, pubKey, [
      "account:provider",
    ]);
    if (!accessToken) {
      console.error("Error generating the provider accessToken");
      return;
    }

    const keyPair = await this.keyService.generateKey();
    if (!keyPair) {
      console.error("Error generating key pair");
      return;
    }

    const address = Utils.arrayBufferToBase64Url(
      await this.keyService.address(keyPair)
    );
    if (!address) {
      console.error("Error generating address");
      return;
    }

    const signature = await Utils.signMessage(
      userId + "." + address,
      keyPair.privateKey
    );
    if (!signature) {
      console.error("Error generating signature");
      return;
    }

    const publicKey = Utils.base64Encode(
      new Uint8Array(await Utils.exportKeyPairToBuffer(keyPair))
    );

    const url = `${this.registerAddressUrl}/${providerId}/user`;
    const bodyData = {
      id: userId,
      address: address,
      pubKey: publicKey,
      signature: signature,
    };

    const headers = new Headers();
    headers.append("accept", "application/json");
    headers.append("content-type", "application/json");
    headers.append("authorization", "Bearer " + accessToken);
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(bodyData),
    });
    if (response.ok) {
      const addressResponse: RegisterAddressRsp = await response.json();
      this.keyService.save(
        keyPair.publicKey,
        keyPair.privateKey,
        `${providerId}.${userId}`
      );
      if (addressResponse.address !== address) {
        console.error("Error registering user. Mismatching user Addresses");
        return;
      }
      return addressResponse.address;
    } else {
      console.error("Error registering user. HTTP status: " + response.status);
      return
    }
  }
}
