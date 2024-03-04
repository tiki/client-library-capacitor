import Capture from "./Capture";
import Auth from "./Auth";
import License from "./License";
import KeyService from "./Key";
import Utils from "./utils";
import { Photo } from "@capacitor/camera";
import { SavedKey } from "./Key/types";
import type {
  PostGuardRequest,
  RspGuard,
  PostLicenseRequest,
} from "./License/types";
import { Config } from "./Config";

export default class TikiClient {
  private static userId: string = "";
  private static keyService = new KeyService();
  private static config: Config;
  public static capture = new Capture();
  public static auth = new Auth(TikiClient.keyService);
  public static license = new License();

  private constructor() {}

  /**
   * Initialize the TikiClient and register the device's address.
   * @param {string} userId - the ID to be registered to identify the user.
   */
  public static async initialize(userId: string): Promise<void> {
    TikiClient.userId = userId;

    const keys = await TikiClient.keyService.get();

    if (
      keys.find(
        (key) => key.value.name === `${TikiClient.config.providerId}.${userId}`
      )
    )
      throw new Error(
        "The address is already registered for these provider and user IDs."
      );

    await TikiClient.auth.registerAddress(
      TikiClient.config.providerId,
      TikiClient.config.publicKey,
      userId
    );
  }

  /**
   * Capture a picture and send it to Tiki.
   * Uses the capture module to take the photo and publish it to Tiki.
   * Also utilizes the license module to verify if the provided license is valid.
   * @param {string} requestId - a UUID string to identify the location of the pictures that are sent.
   */
  public static async scan(requestId?: string) {
    const keys: SavedKey[] = await TikiClient.keyService.get();

    const key: SavedKey | undefined = keys.find(
      (key) =>
        key.value.name ===
        `${TikiClient.config.providerId}.${TikiClient.userId}`
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
      TikiClient.config.providerId,
      signature,
      [],
      address
    );

    if (!addressToken) throw new Error("Error to get Address Token");
    const licenseReq: PostGuardRequest = {
      ptr: TikiClient.userId,
      uses: [
        {
          usecases: [
            {
              value: "ATRIBUTION",
            },
          ],
          destinations: ["*"],
        },
      ],
    };
    const verifyLicense: RspGuard = await TikiClient.license.guard(
      licenseReq,
      addressToken!
    );

    if (!verifyLicense || !verifyLicense.success)
      throw new Error("Unverified License");

    const photos: Photo[] = [await TikiClient.capture.scan()];
    const id = requestId ?? window.crypto.randomUUID();

    await this.capture.publish(photos, id, addressToken);
  }

  /**
   * Create a license to publish data to Tiki
   * @returns
   */
  public static async createLicense(
    licenseReq: PostLicenseRequest
  ): Promise<PostLicenseRequest> {
    const keys: SavedKey[] = await TikiClient.keyService.get();

    const key: SavedKey | undefined = keys.find(
      (key) =>
        key.value.name ===
        `${TikiClient.config.providerId}.${TikiClient.userId}`
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
      TikiClient.config.providerId,
      signature,
      [],
      address
    );

    if (!addressToken)
      throw new Error("It was not possible to get the token, try to inialize!");

    return await TikiClient.license.create(addressToken, licenseReq);
  }

  public static configuration(configuration: Config) {
    TikiClient.config = configuration;
  }
}
