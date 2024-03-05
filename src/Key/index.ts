import { sha3_256 } from "js-sha3";
import Utils from "../utils";
import KeyRepository from "./repository";
import { SavedKey } from "./types";

export default class KeyService {
  private repository: KeyRepository = new KeyRepository();

  /**
   * Saves keys into the web IndexedDB using the Key repository.
   * @param {string} publicKey - The public key used to create an address.
   * @param {string} privateKey - The private key used to create an address.
   * @param {string} userId - The user ID used to create an address.
   */
  public save(publicKey: CryptoKey, privateKey: CryptoKey, userId: string) {
    this.repository.save(publicKey, privateKey, userId);
  }

  /**
   * Uses the Key Repository to list all saved keys pairs
   * @returns - key repository list function
   */
  public async get(providerId: string, userId: string): Promise<SavedKey | undefined> {
    const keys: SavedKey[] =  await this.repository.list();
    return keys.find(
      (key) => key.value.name === `${providerId}.${userId}`
    )
  }

  /**
   * Flush everything saved into IndexedDB
   * @returns - key repository clear function
   */
  public clear() {
    return this.repository.clear();
  }

  /**
   * Returns the hashed key pair in sha3-256 to be used as an address.
   * @param {CryptoKeyPair} keyPair - The key pair to be hashed.
   * @returns {Promise<ArrayBuffer>} The hashed key pair as an ArrayBuffer.
   */
  async address(keyPair: CryptoKeyPair): Promise<ArrayBuffer> {
    const buffer = await Utils.exportKeyPairToBuffer(keyPair);
    const digest = sha3_256.digest(buffer);
    return new Uint8Array(digest);
  }

  /**
   * Use the Web Crypto API to generate a Crypto Key Pair
   * @returns {Promise<CryptoKeyPair>} - A promise containing the Crypto Key Pair Object
   */
  async generateKey(): Promise<CryptoKeyPair> {
    const keypair: CryptoKeyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: "SHA-256",
      },
      false,
      ["sign", "verify"]
    );
    return keypair;
  }
}
