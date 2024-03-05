# TIKI Publish Client Library

The TIKI Data Provider APIs comprise a set of HTTP REST APIs used by [Data Providers](https://mytiki.com/reference/overview) to publish data to TIKI. This enables compatibility with any standard HTTP client for sending requests and handling responses.

The TIKI Publish Client Library simplifies application integration work with convenient methods for authorization, licensing, capture, and upload, reducing the amount of code necessary to connect a web app with TIKI.

## Getting Started

1. Log in to [mytiki.com](https://account.mytiki.com/pages/login) with Gmail, GitHub, or any email account.
2. Use the [Create Provider](https://mytiki.com/reference/account-provider-create) page to create a new provider.
3. In the body-params, insert the Provider name.
4. Click the `try it!` button.
5. Copy the providerId and pubKey values from the JSON in the RESPONSE screen. We'll use those values to configure the client.

## Installation

To install the TIKI Client library, use `npm`:

```bash
npm install @mytiki/publish-client
```

### Using the Camera

The Client Library offers an **optional** method designed for scanning physical receipts via the mobile device camera.

The `TikiClient.scan` method uses the [Capacitor Camera Plugin](https://capacitorjs.com/docs/apis/camera) to scan receipts. To use this method, add the Capacitor Camera dependency:

```bash
npm install @capacitor/camera
```

#### iOS

In order to use the camera in iOS, the app must provide the a message that tells the user why the app is requesting access to the device’s camera. This is done by setting up the `NSCameraUsageDescription` in the `info.plist`.

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
... other existing values
	<key>NSCameraUsageDescription</key>
	<string>The camera is used to scan physical receipts</string>
</dict>
</plist>
```

#### Web Applications

The Capacitor Camera Plugin has a web-based UI available when not running natively. The `TikiClient.scan` method will load a responsive photo-taking experience when running on the web.

This UI is implemented using web components. Due to the elements being encapsulated by the Shadow DOM, these components should not conflict with your own UI.

To enable these controls, you must add `@ionic/pwa-elements` to your app.

```bash
npm install @ionic/pwa-elements
```

Then, depending on your framework of choice, import the element loader and call it at the correct time:

**Vue**

`main.ts`:

```typescript
// Above the createApp() line
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);
```

## Configuration

Before running any commands with the TikiClient library, it needs to be configured. This configuration includes the Provider ID and Public Key obtained in the Provider Registration and the company information for generating the license terms.

```ts
let config: Config = {
  providerId: "<PROVIDER-ID>", // obtained in the JSON response for the Provider creation
  publicKey: "<PUBLIC-KEY>", // obtained in the JSON response for the Provider creation
  companyName: "ACME Inc",
  companyJurisdiction: "Nashville, TN",
  tosUrl: "https://acme.inc/tos",
  privacyUrl: "https://acme.inc/privacy"
}
TikiClient.configure(config)
```

**Vue.use**

For Vue apps, we provide a Vue plugin install method to simplify the configuration.

```ts
import Vue from "vue";
import TikiPlugin from "@mytiki/publish-client-capacitor";

Vue.use(TikiPlugin, {
  providerId: "<PROVIDER-ID>", // obtained in the JSON response for the Provider creation
  publicKey: "<PUBLIC-KEY>", // obtained in the JSON response for the Provider creation
  companyName: "ACME Inc",
  companyJurisdiction: "Nashville, TN",
  tosUrl: "https://acme.inc/tos",
  privacyUrl: "https://acme.inc/privacy"
})
```

## How to use

The TikiClient is a singleton used as the main entry point for all the functionalities of the library. The configuration sets the parameters that will be used by all methods.

### Initialization

This method authenticates with TIKI API and registers the user device to publish data. It is an async method due to the API calls necessary.

The user id can be any arbitrary string that identifies the user in the application using the client library. It is not recommended to use personal identifiable information in this, like emails.

```ts
await TikiClient.initialize("<the-client-user-id>")
```

To change the active user, the `TikiClient.initialize` method must be called again.

### Data License

To successfully capture and upload receipt data to our platform, it is essential to establish a valid User Data License Agreement (UDLA). This agreement serves as a clear, explicit addendum to your standard app terms of service, delineating key aspects:

a) User Ownership: It explicitly recognizes the user as the rightful owner of the data.

b) Usage Terms: It outlines the terms governing how the data will be licensed and used.

c) Compensation: It defines the compensation arrangements offered in exchange for the provided data.

Our Client Library streamlines this process by providing a pre-qualified agreement, filled with the company information provided in the library configuration. 

Use the `TikiClient.terms()` method to retrieve the formatted terms of the license, presented in Markdown. This allows you to present users with a clear understanding of the terms before they agree to license their data. This agreement comes , ensuring a seamless integration into the license registry.

```ts
let terms = TikiClient.terms()
```

Upon user agreement, use the `TikiClient.createLicense` method to generate the license.

```ts
await TikiClient.createLicense()
```

This method needs to be invoked once for each device. Once executed, the license is registered in TIKI storage, eliminating the necessity to recreate it in the future.

### Data Capture

The Client Library offers an **optional** method designed for scanning physical receipts via the mobile device camera.

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

Upon execution, this method returns a unique ID for the request, facilitating easy retrieval of the extracted data in the [Data Cleanroom](https://mytiki.com/reference/data-cleanrooms).

## API Reference
The central API interface in the library is the TikiClient object, designed to abstract the complexities of authorization and API requests. While serving as the primary entry point, it's important to note that all APIs within the library are public and accessible.

For detailed usage instructions, please consult the [TIKI Client API Documentation](https://mytiki.com/reference/client-library/typescript). This comprehensive resource provides direct insights into utilizing the various functionalities offered by the TIKI Client Library.

## Example App

To demonstrate a simple implementation of the TIKI Client library in a Capacitor + Vue.js app, check the [Example App](https://github.com/tiki/publish-client-capacitor/tree/main/example).

# Contributing

- Use [GitHub Issues](https://github.com/tiki/publish-client-capacitor/issues) to report any bugs you find or to request enhancements.
- If you'd like to get in touch with our team or other active contributors, join our 👾 [Discord](https://discord.gg/tiki).
- Please use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) if you intend to add code to this project.