# TIKI Client Library (Capacitor + Vue.js)

The Client Library is a convenient wrapper around our Data Provider APIs to simplify integration with your application.

Our Data Provider APIs are a collection of HTTP REST APIs enabling compatibility with any standard HTTP client for sending requests and handling responses. Functioning as a Capacitor Plugin, the Client Library simplifies application integration work with convenient methods for authorization, licensing, capture, and upload.

## Getting Started

### Instalation

### Configuration

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
