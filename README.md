# TIKI Client Library - Capacitor + Vue Specification

## Technologies Used

1. **Language:** TypeScript
2. **Framework:** Vue.js with Capacitor
3. **Authentication:** AppAuth for OAuth2
4. **Camera Integration:** Capacitor Camera API for receipt image capture
5. **UI Components:** Vue

## Library Structure

1. **TikiClient:** The primary entry point for the TIKI Client Library.

2. **TikiClient.auth:** Handles authentication, token retrieval, revocation, and refresh.

3. **TikiClient.license:** Manages user licenses, including creation, retrieval, revocation, and verification.

4. **TikiClient.email:** Manages email-related operations such as adding, retrieving, and removing email accounts.

5. **TikiClient.capture:** Deals with capturing receipt images, downloading and publishing email receipt data, uploading receipt images, and checking publishing status.

6. **TikiClient.clo:** Handles card-linked offers, including adding cards, retrieving offers, getting user rewards, and publishing transaction information.

## Implementation

### TikiClient

- **Methods:**
  - `initialize(providerId: string, userId: string, company: CompanyInfo)`: Initializes the TikiClient with parameters.
  - `scan() -> Promise<string>`: Initiates the process of scanning a physical receipt and returns the receipt ID.
  - `login(provider: EmailProviderEnum)`: Initiates the process of scraping receipts from emails.
  - `logout(email: string)`: Removes a previously added email account.
  - `accounts() -> Promise<EmailAccount[]>`: Retrieves the list of connected email accounts.
  - `scrape()`: Initiates the process of scraping receipts from emails.
  - `card(last4: string, bin: string, issuer: string, network: string)`: Adds a card for card-linked offers.
  - `offers() -> Promise<Offer[]>`: Retrieves card-linked offers for the user.
  - `transaction(transaction: Transaction)`: Submits a transaction for card-linked offer matching.
  - `rewards() -> Promise<Reward[]>`: Retrieves information about the user's rewards.
  - `widget(theme: Theme?)`: Displays the widget for pre-built UIs with a custom theme.

### TikiClient.auth

- **Methods:**
  - `authenticate() -> Promise<string>`: Authenticates with TIKI and saves the auth and refresh tokens.
  - `token() -> Promise<string>`: Retrieves the authentication token, refreshing if necessary.
  - `revoke() -> Promise<void>`: Revokes the authentication token.
  - `refresh() -> Promise<string>`: Refreshes the authentication token.

### TikiClient.license

- **Methods:**
  - `create() -> Promise<LicenseRecord>`: Creates a new license for the user.
  - `get() -> Promise<License>`: Retrieves the user's active license.
  - `revoke() -> Promise<License>`: Revokes the user's existing license.
  - `verify() -> Promise<boolean>`: Verifies the validity of the user's license.

### Email

- **Methods:**
  - `login(provider: EmailProvider) -> Promise<void>`: Authenticates with OAuth and adds an email account for scraping receipts.
  - `accounts() -> Promise<EmailAccount[]>`: Retrieves the list of connected email accounts.
  - `logout(email: string) -> Promise<void>`: Removes a previously added email account.

### TikiClient.capture

- **Methods:**
  - `camera() -> Promise<string>`: Captures an image of a receipt for processing.
  - `email(onPublish: (receiptId: string) => void) -> Promise<void>`: Downloads potential receipt data from known receipt email senders and publishes it.
  - `publish(data: ImageData) -> Promise<string>`: Uploads receipt images or email data for receipt data extraction.
  - `status(receiptId: string) -> Promise<PublishingStatus>`: Checks the publishing status of the data.

### TikiClient.clo

- **Methods:**
  - `card(last4: string, bin: string, issuer: string, network: string) -> Promise<void>`: Adds a card to the user's account.
  - `offers() -> Promise<Offer[]>`: Retrieves card-linked offers for the user.
  - `rewards() -> Promise<Reward[]>`: Retrieves information about the user's rewards.
  - `transaction(transaction: Transaction) -> Promise<void>`: Sends transaction information to match card-linked offers.

## Documentation

The library should provide comprehensive documentation including:

1. **Getting Started Guide:** Instructions on how to integrate the library into a Capacitor + Vue.js project.
2. **API Reference:** Detailed documentation for each class, method, and parameter.
3. **Sample Code:** Examples demonstrating how to use key functionalities of the library.
4. **Configuration Guide:** Guidelines on setting up TIKI credentials and other necessary configurations.
5. **Error Handling:** Information on handling errors and exceptions.
6. **Example App** An example app with basic UI, for manual testing.

## Non-Native Dependencies

- AppAuth for OAuth2.
- Capacitor Camera API for image capture.