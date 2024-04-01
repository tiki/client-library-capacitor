# TIKI Publish Client Library

The TIKI Data Provider APIs comprise a set of HTTP REST APIs used by [Data Providers](https://mytiki.com/reference/overview) to publish data to TIKI. This enables compatibility with any standard HTTP client for sending requests and handling responses.

The TIKI Publish Client Library simplifies application integration by providing convenient methods for authorization, licensing, capture, and upload, reducing the amount of code necessary to connect a web app with TIKI.

## Getting Started

To begin, visit [mytiki.com](https://mytiki.com) and apply for beta access. Our team will then set up the provider ID and public key for your project, which you'll use to configure the client.

## Installation

Install the TIKI Client library using `npm`:

```bash
npm install @mytiki/publish-client
```
### Capacitor App

We utilize the Capacitor App library to extract the app ID from the native code, which is then used to register the origin of the records. While this library is common in Capacitor projects, it is not mandatory. If your application does not already include it, please add it using the following command:

```bash
npm install @capacitor/app
``` 

### Using the Camera

The Client Library offers an **optional** method for scanning physical receipts via the mobile device camera.

The `TikiClient.scan` method utilizes the [Capacitor Camera Plugin](https://capacitorjs.com/docs/apis/camera) for scanning receipts. To use this method, include the Capacitor Camera dependency:

```bash
npm install @capacitor/camera
```

#### iOS

For iOS, the app must provide a message explaining why it needs access to the device's camera. This is done by setting up the `NSCameraUsageDescription` in the `info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>The camera is used to scan physical receipts</string>
```

#### Android

To use the camera on Android, add the following permissions to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29"/>
```

## Configuration

Before executing any commands with the TikiClient library, you need to configure it. This includes providing the Provider ID and Public Key obtained during Provider Registration, as well as company information for generating license terms.

```ts
let config: Config = {
  providerId: "<PROVIDER-ID>", // Provided by TIKI
  publicKey: "<PUBLIC-KEY>", // Provided by TIKI
  companyName: "ACME Inc",
  companyJurisdiction: "Nashville, TN",
  tosUrl: "https://acme.inc/tos",
  privacyUrl: "https://acme.inc/privacy"
}
TikiClient.configure(config)
```

**Vue.use**

For Vue apps, we provide a Vue plugin installation method to simplify configuration:

```ts
import Vue from "vue";
import TikiPlugin from "@mytiki/publish-client-capacitor";

Vue.use(TikiPlugin, {
  providerId: "<PROVIDER-ID>", // Provided by TIKI
  publicKey: "<PUBLIC-KEY>", // Provided by TIKI
  companyName: "ACME Inc",
  companyJurisdiction: "Nashville, TN",
  tosUrl: "https://acme.inc/tos",
  privacyUrl: "https://acme.inc/privacy"
})
```

## How to Use

The TikiClient is a singleton used as the main entry point for all functionalities of the library. The configuration sets the parameters used by all methods.

### Initialization

This method authenticates with the TIKI API and registers the user's device to publish data. It is an asynchronous method due to the necessary API calls.

The user ID can be any arbitrary string that identifies the user in the application using the client library. It is not recommended to use personally identifiable information, such as emails. If necessary, use a hashed version of it.

```ts
await TikiClient.initialize("<the-client-user-id>")
```

To switch the active user, call the `TikiClient.initialize` method again.

### Data License

To successfully capture and upload receipt data to our platform, it is essential to establish a valid User Data License Agreement (UDLA). This agreement serves as a clear, explicit addendum to your standard app terms of service, delineating key aspects:

a) User Ownership: It explicitly recognizes the user as the rightful owner of the data.

b) Usage Terms: It outlines the terms governing how the data will be licensed and used.

c) Compensation: It defines the compensation arrangements offered in exchange for the provided data.

Our Client Library streamlines this process by providing a pre-qualified agreement, filled with the company information provided in the library configuration. 

Retrieve the formatted terms of the license, presented in Markdown, using the `TikiClient.terms()` method. This allows you to present users with a clear understanding of the terms before they agree to license their data. This agreement comes , ensuring a seamless integration into the license registry.

```ts
let terms = TikiClient.terms()
```

Upon user agreement, generate the license using the `TikiClient.createLicense` method.

```ts
await TikiClient.createLicense()
```

This method needs to be invoked once for each device. Once executed, the license is registered in TIKI storage, eliminating the need to recreate it in the future.

### Data Capture

The Client Library offers an **optional** method for scanning physical receipts via the mobile device camera.

Use the `TikiClient.scan()` method to trigger the receipt scanning process, leveraging the Capacitor Camera plugin. This method returns a `Promise` containing the base64 representation of the captured `image/jpg`.

```ts
const image = await TikiClient.scan();
```

### Data Upload

Utilize the `TikiClient.publish` method to upload receipt images to TIKI for processing. This method is versatile, as it can receive results from the `TikiClient.scan` method, or your application can implement a custom scan extraction method, sending the results to `TikiClient.publish`.

The `images` parameter accepts an array of base64 image strings, providing flexibility to capture and scan multiple images, ideal for processing lengthy receipts.

```ts
const image = await TikiClient.scan();
await TikiClient.publish([image]);
```

Upon execution, this method returns a unique ID for the receipt, facilitating easy retrieval of the extracted data in the [Data Cleanroom](https://mytiki.com/reference/data-cleanrooms).

## API Reference

The central API interface in the library is the TikiClient object, designed to abstract the complexities of authorization and API requests. While serving as the primary entry point, it's important to note that all APIs within the library are public and accessible.

For detailed usage instructions, please consult the [TIKI Client API Documentation](https://mytiki.com/reference/client-library/typescript). This comprehensive resource provides direct insights into utilizing the various functionalities offered by the TIKI Client Library.

## Example App

To see a simple implementation of the TIKI Client library in a Capacitor + Vue.js app, check the [Example App](https://github.com/tiki/publish-client-capacitor/tree/main/example).

# Contributing

- Use [GitHub Issues](https://github.com/tiki/publish-client-capacitor/issues) to report bugs or

 request enhancements.
- To contact our team or other active contributors, join our 👾 [Discord](https://discord.gg/tiki).
- Please adhere to [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) when contributing code to this project.
