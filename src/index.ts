import Capture from "./Capture";
import Auth from "./Auth";
import License from "./License";
import KeyService from "./Key";
import Utils from "./utils";
import { Photo } from "@capacitor/camera";
import { SavedKey } from "./Key/types";
import type { PostGuardRequest, RspGuard, PostLicenseRequest} from "./License/types";

export default class TikiClient {
  private static keyService = new KeyService();

  public static capture = new Capture();
  public static auth = new Auth(TikiClient.keyService);
  public static license = new License();

  private constructor() {}

  /**
   * Initialize the TikiClient and register the device's address.
   * @param {string} providerId - the provider ID of the associated provider account.
   * @param {string} pubKey - the public key of the created provider.
   * @param {string} userId - the ID to be registered to identify the user.
   */
  public static async initialize(
    providerId: string,
    pubKey: string,
    userId: string
  ): Promise<void> {
    await TikiClient.keyService.clear();

    const keys = await TikiClient.keyService.get();

    if (keys.find((key) => key.value.name === `${providerId}.${userId}`))
      throw new Error(
        "TThe address is already registered for these provider and user IDs."
      );

    await TikiClient.auth.registerAddress(providerId, pubKey, userId);
  }

  /**
   * Capture a picture and send it to Tiki.
   * Uses the capture module to take the photo and publish it to Tiki.
   * Also utilizes the license module to verify if the provided license is valid.
   * @param {string} providerId - the provider ID of the associated provider account.
   * @param {string} userId - The user ID to link the receipt to their information.
   * @param {PostGuardRequest} licenseReq - the License pointer record and use cases to verify if the license is valid.
   * @param {string} requestId - a UUID string to identify the location of the pictures that are sent.
   */
  public static async scan(
    providerId: string,
    userId: string,
    licenseReq: PostGuardRequest,
    requestId?: string
  ) {
    const keys: SavedKey[] = await TikiClient.keyService.get();

    const key: SavedKey | undefined = keys.find(
      (key) => key.value.name === `${providerId}.${userId}`
    );

    if (!key) throw new Error("Key Pair not found, try to initialize");

    const address: string = Utils.arrayBufferToBase64Url(
      await TikiClient.keyService.address(key.value)
    );

    const signature: string = await Utils.generateSignature(
      address,
      key?.value.privateKey
    );

    const addressToken: string | undefined = await TikiClient.auth.getToken(
      providerId,
      signature,
      [],
      address
    );

    if (!addressToken) throw new Error("Error to get Address Token");

    const verifyLicense: RspGuard = await TikiClient.license.guard(
      licenseReq,
      addressToken!
    );

    if (!verifyLicense || !verifyLicense.success)
      throw new Error("Unverified License");

    const photos: Photo[] = [await TikiClient.capture.scan()];
    const id = requestId ?? window.crypto.randomUUID();

    await this.capture.publish(photos, id);
  }

  /**
   * Create a license to publish data to Tiki
   * @param {string} providerId - the provider ID of the associated provider account.
   * @param {string} userId - The user ID to link the receipt to their information.
   * @param {PostLicenseRequest} licenseReq - The object that contains the license information
   * @returns 
   */
  public static async createLicense(providerId: string, userId: string, licenseReq: PostLicenseRequest): Promise<PostLicenseRequest>{
    const keys: SavedKey[] = await TikiClient.keyService.get();

    const key: SavedKey | undefined = keys.find(
      (key) => key.value.name === `${providerId}.${userId}`
    );

    if (!key) throw new Error("Key Pair not found, try to initialize");

    const address: string = Utils.arrayBufferToBase64Url(
      await TikiClient.keyService.address(key.value)
    );

    const signature: string = await Utils.generateSignature(
      address,
      key?.value.privateKey
    );

    const addressToken: string | undefined = await TikiClient.auth.getToken(
      providerId,
      signature,
      [],
      address
    );

    if(!addressToken) throw new Error('It was not possible to get the token, try to inialize!')
    
    return await TikiClient.license.create(addressToken, licenseReq)
  }
}
