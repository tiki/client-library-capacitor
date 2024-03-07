# TIKI Publish Client Library Example App

The TIKI Data Provider APIs comprise a set of HTTP REST APIs used by [Data Providers](https://mytiki.com/reference/overview) to publish data to TIKI. This enables compatibility with any standard HTTP client for sending requests and handling responses.

The TIKI Publish Client Library simplifies application integration work with convenient methods for authorization, licensing, capture, and upload, reducing the amount of code necessary to connect a web app with TIKI.

This Example App works as a sample of how use our library's main featur

## Getting Started

1. Log in to [mytiki.com](https://account.mytiki.com/pages/login) with Gmail, GitHub, or any email account.
2. Use the [Create Provider](https://mytiki.com/reference/account-provider-create) page to create a new provider.
3. In the body-params, insert the Provider name.
4. Click the `try it!` button.
5. Copy the providerId and pubKey values from the JSON in the RESPONSE screen. 
6. Paste the values into the vue plugin config object inside the main.js file.
    - Example:
    ```javascript
        import Vue from "vue";
        import TikiPlugin from "@mytiki/publish-client-capacitor";

        Vue.use(TikiPlugin, {
        providerId: "prov-id",
        publicKey: "pubkey",
        companyName: "ACME Inc",
        companyJurisdiction: "Nashville, TN",
        tosUrl: "https://acme.inc/tos",
        privacyUrl: "https://acme.inc/privacy"
        })
    ```

## Using the application


### Web Browser

1 - install the dependencies

```bash
npm install 
```

2 - Start a local development server

```bash
npm run serve 
```

### Android/iOS

1 - install the dependencies 

```bash
npm install 
```

2 - Build the project 

```bash
npm run build 
```

3 - Run the project in android/ios (needs a phisycal device or emulator configurated)

Android:
```bash
npx cap run android
```

iOS:
```bash
npx cap run ios 
```

## Features

The User Interface of the project is really simple. It contains a input to the user inform an identifier, which will be used to iniatilize the application.


### Initialize 
The Initialize button calls the Method which the same name, using the value of the input, or a random UUID string if the input is empty.

### Scan
The Scan button uses Capacitor/Ionic plugins to take a picture and store the base64 of that picture into an array. The application should already be initialized to use this feature.
The saved picture will be displayed in the UI, and a counter of many pictures is saved

### Publish
The Last button will create a license and use it to send the array of images to Tiki, publishing it into our Back-end.


