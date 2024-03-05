# TIKI Publish Client Library

### Provider registration

The TIKI Data Provider APIs are a collection of HTTP REST APIs used by [Data Providers](https://mytiki.com/reference/overview) to publish data to TIKI enabling compatibility with any standard HTTP client for sending requests and handling responses

The TIKI Publish Client Library simplifies application integration work with convenient methods for authorization, licensing, capture, and upload, reducing the amount of code necessary to connect a web app with TIKI.

## Getting Started

1. Login in [mytiki.com](https://account.mytiki.com/pages/login) with Gmail, GitHub or any email account.
2. Use the [Create Provider](https://mytiki.com/reference/account-provider-create) page to create a new provider.
   1. In the body-params insert a the Provider name.
   2. Click in the `try it!` button
3. Copy the providerId and pubKey values from the JSON in the RESPONSE screen. We'll use those values to configure the client.

### Instalation

To install the TIKI Client library use `npm`:

```bash
npm install @mytiki/publish-client
```

#### Capacitor Camera 

The `TikiClient.scan` method uses the [Capacitor Camera Plugin]() to scan receipts. 
To use this method add the Capacitor Camera dependency: 

```bash
npm install @capacitor/camera
```

Capacitor Camera Plugin have web-based UI available when not running natively. The `TikiClient.scan` method will load a responsive photo-taking experience when running on the web.

This UI is implemented using web components. Due the elements being encapsulated by the Shadow DOM, these components should not conflict with your own UI.

To enable these controls, you must add `@ionic/pwa-elements` to your app.

```bash
npm install @ionic/pwa-elements
```

Then, depending on your framework of choice, import the element loader and call it at the correct time:

##### React

`main.tsx` or `index.tsx` or `index.js`:

```tsx
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Call the element loader before the render call
defineCustomElements(window);
```

##### Vue

`main.ts`:

```typescript
// Above the createApp() line
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);
```

##### Angular

`main.ts`:

```typescript
import { defineCustomElements } from '@ionic/pwa-elements/loader';
// Call the element loader before the bootstrapModule/bootstrapApplication call
defineCustomElements(window);
if (environment.production) {
  enableProdMode();
}
```

##### Including through script tag

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

The library configuration can be done directly with the TikiClient

## How to use

### The Client Library

### Data Licensing

Capturing and uploading receipt data to our platform requires a valid user data license agreement (UDLA). A UDLA is an explicit agreement in addition to your standard app terms of service that defines: a) the user as the owner of the data, b) the terms around how it will be licensed, used, and c) the compensation offered in exchange. 

The Client Library includes a templated, pre-qualified agreement. Use the library to either explicitly request user consent or allow the library to automatically show the license agreement flow upon first data upload.  

```typescript
await TikiService.license();
```

### Data Capture

The Client Library includes **optional** methods for: a) scanning physical receipts using the mobile device camera, and b) extracting receipts from connected email accounts. 

#### Physical Receipt Scanning

The [Capacitor camera plugin](https://capacitorjs.com/docs/apis/camera) is employed to open the camera and capture images for receipt scanning. Users have the flexibility to capture multiple images for scanning lengthy receipts. These image are temporarily stored in memory and combined before the upload process. 

Utilize the `TikiService.scan()` method to initiate the scanning of a receipt. This method returns a `Promise` containing an ID for the receipt, which can used to locate the extracted data in your [Data Cleanroom](ref:data-cleanrooms). Upon completion of the image capture, the resulting image is automatically uploaded —see [Data Upload](#data-upload).

```typescript
const receiptId = await TikiService.receipt.scan();
```

### Data Upload

When utilizing the `receipt.scan()` or `receipt.email()` methods captured data is automatically uploaded to our platform for processing. Alternatively, the application can implement its own custom scan and email extraction methods and utilize the `receipt.upload(...)` method to submit records. 

All data uploads require a valid User Data License Agreement. If one does not exist for the user, the Client Library will automatically present the user with the License Agreement flow. If the user has declined participation in the program  an error is returned and the data is discarded. 

```typescript
const emailRequest = {
  sender: "john.doe@example.com",
  body: "Thank you for your purchase",
  attachments: [file1, file2]
}

const scanRequest = {
  attachement: [image1]
}

const emailReceiptId = await TikiService.receipt.upload(emailRequest);
const scanReceiptId = await TikiService.receipt.upload(scanRequest);
```



## API Reference

## Example App

## Contribute
