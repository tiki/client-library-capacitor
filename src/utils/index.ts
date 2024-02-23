export default class Utils {

  public async handleRequest<T>(url: string, method: string, token: string, body?: object): Promise<T> {

    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    headers.append('Content-Type', 'application/json')
    headers.append('Access-Control-Allow-Origin', 'http://localhost:5173')
    headers.append('Access-Control-Allow-Credentials', 'true')

    const requestOptions: RequestInit = {
      method,
      headers: headers
    }

    if (body) {
      requestOptions.body = JSON.stringify(body)
    }

    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      const errorBody = await response.json()
      throw errorBody
    }

    return response.json()
  }

  public static base64StringToFile(base64String: string, filename: string): File {
    const byteCharacters = atob(base64String)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'application/octet-stream' })
    return new File([blob], filename)
  }

  public static async exportKeyPairToBuffer(keyPair: CryptoKeyPair): Promise<ArrayBuffer> {
    const publicKeyExported = await window.crypto.subtle.exportKey(
      'spki',
      keyPair.publicKey,
    )
    return new Uint8Array(publicKeyExported).buffer;
  }

  public static base64Encode = (bytes: Uint8Array): string =>
    btoa(
      bytes.reduce((acc, current) => acc + String.fromCharCode(current), ''),
    )

  public static async signMessage(
    message: string,
    privateKey: CryptoKey,
  ): Promise<string | null> {
      const signature = await crypto.subtle.sign(
        { name: 'RSASSA-PKCS1-v1_5' },
        privateKey,
        new TextEncoder().encode(message),
      )
      return this.base64Encode(new Uint8Array(signature))
  }

  public static arrayBufferToBase64Url(arrayBuffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(arrayBuffer)

    const base64String = btoa(String.fromCharCode(...uint8Array))

    const base64Url = base64String
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    return base64Url
  }
}

