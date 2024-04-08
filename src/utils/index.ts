/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

/**
 * Utils provides utility functions for handling various tasks such as network requests, 
 * cryptography, and data conversion across the library.
 */
export default class Utils {

  /**
   * Handles an HTTP request with the provided URL, method, token, and optional body. 
   * 
   * The expected result type is passed in the generic parameter T.
   * 
   * @param url - The URL to send the request to.
   * @param method - The HTTP method (e.g., GET, POST).
   * @param token - The authorization token.
   * @param body - Optional body data to send with the request.
   * @returns A Promise resolving to the response data.
   */
  public async handleRequest<T>(
    url: string,
    method: string,
    token: string,
    body?: object
  ): Promise<T> {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Origin", "http://localhost:5173");
    headers.append("Access-Control-Allow-Credentials", "true");

    const requestOptions: RequestInit = {
      method,
      headers: headers,
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorBody = await response.json();
      throw errorBody;
    }

    return response.json();
  }

  /**
   * Converts a base64 string to a File object.
   * @param base64String - The base64 string to convert.
   * @param filename - The filename for the resulting File object.
   * @returns The File object.
   */
  public static base64StringToFile(
    base64String: string,
    filename: string
  ): File {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/octet-stream" });
    return new File([blob], filename);
  }

  /**
   * Converts a CryptoKeyPair's public key to an ArrayBuffer.
   * 
   * @param keyPair - The CryptoKeyPair containing the public key.
   * @returns The ArrayBuffer representing the public key.
   */
  public static async exportPublicKeyToBuffer(
    keyPair: CryptoKeyPair
  ): Promise<ArrayBuffer> {
    const publicKeyExported = await window.crypto.subtle.exportKey(
      "spki",
      keyPair.publicKey
    );
    return new Uint8Array(publicKeyExported).buffer;
  }

  /**
   * Encodes a Uint8Array to base64 string.
   * 
   * @param bytes - The Uint8Array to encode.
   * @returns The base64 encoded string.
   */
  public static base64Encode = (bytes: Uint8Array): string =>
    btoa(
      bytes.reduce((acc, current) => acc + String.fromCharCode(current), "")
    );

  /**
   * Signs a message with the given private key using RSASSA-PKCS1-v1_5 algorithm.
   * 
   * @param message - The message to sign.
   * @param privateKey - The private key to sign the message with.
   * @returns The base64 encoded signature of the message.
   */
  public static async signMessage(
    message: string,
    privateKey: CryptoKey
  ): Promise<string> {
    const signature = await crypto.subtle.sign(
      { name: "RSASSA-PKCS1-v1_5" },
      privateKey,
      new TextEncoder().encode(message)
    );
    return this.base64Encode(new Uint8Array(signature));
  }

  /**
   * Converts an ArrayBuffer to a base64 URL-safe string.
   * 
   * @param arrayBuffer - The ArrayBuffer to convert.
   * @returns The base64 URL-safe string.
   */
  public static arrayBufferToBase64Url(arrayBuffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(arrayBuffer);

    const base64String = btoa(String.fromCharCode(...uint8Array));

    const base64Url = base64String
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    return base64Url;
  }

  /**
   * Signs a message with the given private key using RSASSA-PKCS1-v1_5 algorithm.
   * 
   * @param message - The message to sign.
   * @param privateKey - The private key to sign the message with.
   * @returns The base64 encoded signature of the message.
   */
  public static async generateSignature(
    address: string,
    privateKey: CryptoKey
  ): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(address);

    const signature = await crypto.subtle.sign(
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" },
      },
      privateKey,
      new Uint8Array(data)
    );

    return this.base64Encode(new Uint8Array(signature));
  }

  /**
   * Converts a base64 string to a Blob.
   * 
   * @param base64Data - The base64 string to convert.
   * @param contentType - The content type of the Blob.
   * @returns The Blob object.
   */
  public static base64toBlob(base64Data: string, contentType: string): Blob {
    contentType = contentType || "";
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  /**
   * Modifies content by replacing specific words with new ones.
   * 
   * @param content - The content to modify.
   * @param replacements - An object containing the original words as keys and the new words as values.
   * @returns The modified content.
   */
  public static modifyMarkdownContent(
    content: string,
    replacements: { [key: string]: string }
  ): string {
    let modifiedContent = content;
    for (const [originalWord, newWord] of Object.entries(replacements)) {
      modifiedContent = modifiedContent.replace(
        new RegExp(originalWord, "g"),
        newWord
      );
    }
    return modifiedContent;
  }
}
