# TIKI Publish Client Library

The TIKI Data Provider APIs consist of a collection of HTTP REST APIs used by [Data Providers](https://mytiki.com/reference/overview) to publish data to TIKI, enabling compatibility with any standard HTTP client for sending requests and handling responses.

The TIKI Publish Client Library simplifies application integration work with convenient methods for authorization, licensing, capture, and upload, reducing the amount of code necessary to connect a web app with TIKI.

## Getting Started

  1. Log in to [mytiki.com](https://account.mytiki.com/pages/login) with Gmail, GitHub, or any email account.
  2. Use the [Create Provider](https://mytiki.com/reference/account-provider-create) page to create a new provider.
  3. In the body-params, insert the Provider name.
  4. Click the `try it!` button.
  5. Copy the providerId and pubKey values from the JSON in the RESPONSE screen. We'll use those values to configure the client.


### Installation

To install the TIKI Client library, use `npm`:

```bash
npm install @mytiki/publish-client
```

#### Using the Camera 

The `TikiClient.scan` method uses the [Capacitor Camera Plugin]() to scan receipts. 
To use this method, add the Capacitor Camera dependency: 

```bash
npm install @capacitor/camera
```

The Capacitor Camera Plugin has a web-based UI available when not running natively. The `TikiClient.scan` method will load a responsive photo-taking experience when running on the web.

This UI is implemented using web components. Due to the elements being encapsulated by the Shadow DOM, these components should not conflict with your own UI.

To enable these controls, you must add `@ionic/pwa-elements` to your app.

```bash
npm install @ionic/pwa-elements
```

Then, depending on your framework of choice, import the element loader and call it at the correct time:

**React**

`main.tsx` or `index.tsx` or `index.js`:

```tsx
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Call the element loader before the render call
defineCustomElements(window);
```

**Vue**

`main.ts`:

```typescript
// Above the createApp() line
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);
```

**Angular**

`main.ts`:

```typescript
import { defineCustomElements } from '@ionic/pwa-elements/loader';
// Call the element loader before the bootstrapModule/bootstrapApplication call
defineCustomElements(window);
if (environment.production) {
  enableProdMode();
}
```

**Including through script tag**

PWA Elements can be included through a script tag in your `index.html`. However, keep in mind this will not work for offline scenarios:

```html
<script
  type="module"
  src="https://unpkg.com/@ionic/pwa-elements@latest/dist/ionicpwaelements/ionicpwaelements.esm.js"
></script>
<script
  nomodule
  src="https://unpkg.com/@ionic/pwa-elements@latest/dist/ionicpwaelements/ionicpwaelements.js"
></script>
```

### Configuration

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
This method authenticates with TIKI API and register the user device to publish data. It is an async method due to the API calls necessary.

The user id can be any arbitrary string that identifies the user in the application using the client library. 
It is not recommended to use personal identifiable information in this, like emails. 

```ts
await TikiClient.initialize("<the-client-user-id>")
```

To change the active user, the `TikiClient.initialize` method must be called again.

### Data License
Capturing and uploading receipt data to our platform requires a valid user data license agreement (UDLA). A UDLA is an explicit agreement in addition to your standard app terms of service that defines: a) the user as the owner of the data, b) the terms around how it will be licensed, used, and c) the compensation offered in exchange. 

The Client Library includes a templated, pre-qualified agreement. Use the library to either explicitly request user consent or allow the library to automatically show the license agreement flow upon first data upload.  

This method must be called one time in each device the user uses. Once it is called the license is registered for that device and doesn't need to be called again.

```ts
await TikiClient.createLicense()
```

### Data Capture
The Client Library includes an **optional** method for scanning physical receipts using the mobile device camera.

Utilize the `TikiClient.scan()` method to initiate the scanning of a receipt, using the Capacitor Camera plugin. This method returns a `Promise` with the `ByteArray` of the captured `image/jpg`.

```ts
let image = await TikiClient.scan()
```

### Data Upload
Use the `TikiClient.publish` method to upload the receipt images to TIKI for processing. It can receive the results of the `TikiClient.scan` method or the application can implement its own custom scan extraction method and send the results to `TikiClient.publish`.

The `images` parameter receives an array of base64 image strings, which enables the flexibility to capture multiple images for scanning lengthy receipts.

```ts
let image = await TikiClient.scan()
await TikiClient.publish([image])
```

The result of this method is a unique ID for the request, which can used to locate the extracted data in the [Data Cleanroom](ref:data-cleanrooms). 

## API Reference
The TikiClient object is the main API interface for the the library to simplify the multiple layers of authorization and API requests, but all the APIs are public and available.

Refer to the TIKI Client API Documentation for direct usage.

## Example App
To demonstrate a simple implementation of the TIKI Client library in a Capacitor + Vue.js app, check the Example App.

# Contributing

- Use [GitHub Issues](https://github.com/tiki/publish-client-capacitor/issues) to report any bugs you find or to request enhancements.
- If you'd like to get in touch with our team or other active contributors, pop in our 👾 [Discord](https://discord.gg/tiki).
- Please use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) if you intend to add code to this project.

