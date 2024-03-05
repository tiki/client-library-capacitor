import Capture from "../Capture";
import Auth from "../Auth";
import License from "../License";
import KeyService from "../Key";
import Utils from "../utils";
import { Photo } from "@capacitor/camera";
import type {
  PostGuardRequest,
  RspGuard,
  PostLicenseRequest,
} from "../License/types/index";
import { Config } from "../Config";

export default class TikiClient {
  private static instance: TikiClient;

  private userId: string | undefined;
  private config: Config | undefined;
  private keyService = new KeyService();
  
  public capture = new Capture();
  public auth = new Auth(TikiClient.instance.keyService);
  public license = new License();

  private constructor() { }

  /**
   * Get the singleton instance of TikiClient.
   */
  public static getInstance(): TikiClient {
    if (!TikiClient.instance) {
      TikiClient.instance = new TikiClient();
    }
    return TikiClient.instance;
  }

  /**
   * Initialize the TikiClient and register the device's address.
   * @param {string} userId - the ID to be registered to identify the user.
   */
  public static async initialize(userId: string): Promise<void> {
  
   if(TikiClient.instance.config == undefined) 
    throw new Error(
      "TIKI Client is not configured. Use the TikiClient.configure method to add a configuration."
    );

    const key = await TikiClient.instance.keyService.get(
      TikiClient.instance.config.providerId,
      userId
    );

    if (!key){
      await TikiClient.instance.auth.registerAddress(
        TikiClient.instance.config.providerId,
        TikiClient.instance.config.publicKey,
        userId
      );
    }

    TikiClient.instance.userId = userId
  }

  /**
   * Capture a picture and send it to Tiki.
   * Uses the capture module to take the photo and publish it to Tiki.
   * Also utilizes the license module to verify if the provided license is valid.
   * @param {string} requestId - a UUID string to identify the location of the pictures that are sent.
   */
  public static async scan(requestId?: string) {

    if(TikiClient.instance.config == undefined) 
      throw new Error(
        "TIKI Client is not configured. Use the TikiClient.configure method to add a configuration."
      );
    
    if(TikiClient.instance.userId == undefined) 
      throw new Error(
        "User id not defined. Use the TikiClient.initialize method to register the user."
      );

    const key = await TikiClient.instance.keyService.get(
      TikiClient.instance.config.providerId,
      TikiClient.instance.userId
    );

    if (!key) 
      throw new Error("Key Pair not found. Use the TikiClient.initialize method to register the user.");

    const address: string = Utils.arrayBufferToBase64Url(
      await TikiClient.instance.keyService.address(key.value)
    );

    const signature: string = await Utils.generateSignature(
      address,
      key?.value.privateKey
    );

    const addressToken: string | undefined = await TikiClient.instance.auth.getToken(
      TikiClient.instance.config.providerId,
      signature,
      [],
      address
    );

    if (!addressToken) 
      throw new Error("Failed to get Address Token");

    const licenseReq: PostGuardRequest = {
      ptr:TikiClient.instance.userId,
      uses: [
        {
          usecases: [
            {
              value: "attribution",
            },
          ],
          destinations: ["*"],
        },
      ],
    };

    const verifyLicense: RspGuard = await TikiClient.instance.license.guard(
      licenseReq,
      addressToken!
    );

    if (!verifyLicense || !verifyLicense.success)
      throw new Error("The License is invalid. Use the TikiClient.license method to issue a new License.");

    const photos: Photo[] = [await TikiClient.instance.capture.scan()];
    const id = requestId ?? window.crypto.randomUUID();

    await TikiClient.instance.capture.publish(photos, id, addressToken);
  }

  /**
   * Create a license to publish data to Tiki
   * @returns
   */
  public static async createLicense(): Promise<PostLicenseRequest> {

    if(TikiClient.instance.config == undefined) 
      throw new Error(
        "TIKI Client is not configured. Use the TikiClient.configure method to add a configuration."
      );
    
    if(TikiClient.instance.userId == undefined) 
      throw new Error(
        "User id not defined. Use the TikiClient.initialize method to register the user."
      );

    const key = await TikiClient.instance.keyService.get(
      TikiClient.instance.config.providerId,
      TikiClient.instance.userId
    );

    if (!key) 
    throw new Error("Key Pair not found. Use the TikiClient.initialize method to register the user.");

    const address: string = Utils.arrayBufferToBase64Url(
      await TikiClient.instance.keyService.address(key.value)
    );

    const signature: string = await Utils.generateSignature(
      address,
      key?.value.privateKey
    );

    const addressToken: string | undefined = await TikiClient.instance.auth.getToken(
      TikiClient.instance.config.providerId,
      signature,
      [],
      address
    );

    if (!addressToken)
      throw new Error("It was not possible to get the token, try to inialize!");

    const licenseReq: PostLicenseRequest = {
      ptr:TikiClient.instance.userId,
      tags: ["purchase_history"],
      uses: [
        {
          usecases: [
            {
              value: "attribution",
            },
          ],
          destinations: ["*"],
        },
      ],
      licenseDesc: "",
      expiry: undefined,
      titleDesc: undefined,
      terms: await TikiClient.instance.license.terms(
        TikiClient.instance.config.companyName,
        TikiClient.instance.config.companyJurisdiction,
        TikiClient.instance.config.tosUrl,
        TikiClient.instance.config.privacyUrl
      ),
    };
    return await TikiClient.instance.license.create(addressToken, licenseReq);
  }

  public static configuration(configuration: Config) {
    TikiClient.instance.config = configuration;
  }
}
