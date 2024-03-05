import { SplashScreen } from '@capacitor/splash-screen'
import TikiClient from '../../..';

Vue.use(TikiClient, {
  providerId: "the-provider-id",
  publicKey: "the-public-key",
  companyName: "ACME Inc",
  companyJurisdiction: "Nashville, TN",
  tosUrl: "https://acme.inc/tos",
  privacyUrl: "https://acme.inc/privacy"
})

window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super()

      SplashScreen.hide()

      const root = this.attachShadow({ mode: 'open' })

      root.innerHTML = `
    <style>
      :host {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        display: block;
        width: 100%;
        height: 100%;
      }
      h1, h2, h3, h4, h5 {
        text-transform: uppercase;
      }
      .button {
        display: inline-block;
        padding: 10px;
        background-color: #73B5F6;
        color: #fff;
        font-size: 0.9em;
        border: 0;
        border-radius: 3px;
        text-decoration: none;
        cursor: pointer;
        margin-bottom: 1rem;
      }
      main {
        padding: 15px;
      }
      main hr { height: 1px; background-color: #eee; border: 0; }
      main h1 {
        font-size: 1.4em;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      main h2 {
        font-size: 1.1em;
      }
      main h3 {
        font-size: 0.9em;
      }
      main p {
        color: #333;
      }
      main pre {
        white-space: pre-line;
      }
      .main-container{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
      }
      img{
        width: 200px;
      }
    </style>
    <div>
      <capacitor-welcome-titlebar>
        <h1>Example App</h1>
      </capacitor-welcome-titlebar>
      <main>
        <div class="main-container">
          <div>
            <button class="button" id="take-photo">Take Photo</button>
          </div>
          <div>
            <button class="button" id="publish-photo">Publish Photo</button>
          </div>
          <div>
            <button class="button" id="register-address">Register Address</button>
          </div>
          <div>
            <button class="button" id="create-license">Create License</button>
          </div>
          <div>
            <button class="button" id="get-license">Get License</button>
          </div>
          <div>
            <button class="button" id="verify-license">Verify License</button>
          </div>
          <div>
            <button class="button" id="initialize-client">Initialize</button>
          </div>
          <div>
            <button class="button" id="scan-method">Scan</button>
          </div>
          <div id="photo-container">

          </div>
        </div>
      </main>
    </div>
    `
    }

    connectedCallback() {
      const self = this
      const samplePostLicenseRequest = {
        ptr: "example-ptr",
        tags: ["tag1", "tag2"],
        uses: [
          {
            usecases: [{ value: "usecase1" }, { value: "usecase2" }],
            destinations: ["destination1", "destination2"]
          },
          {
            usecases: [{ value: "usecase3" }],
            destinations: ["destination3"]
          }
        ],
        terms: "Sample terms",
        expiry: "2024-12-31",
        titleDesc: "Title description",
        licenseDesc: "License description"
      }

      const sampleGuardRequest = {
        ptr: "example-ptr",
        uses: [
          {
            usecases: [{ value: "usecase1" }, { value: "usecase2" }],
            destinations: ["destination1", "destination2"]
          },
          {
            usecases: [{ value: "usecase3" }],
            destinations: ["destination3"]
          }
        ],
      }
      let photos = []
      self.shadowRoot
        .querySelector('#take-photo')
        .addEventListener('click', async function (e) {
          try {
            let photo = await this.$tiki.capture.scan()

            console.log(photo)
            let img = document.createElement('img')
            img.src = 'data:image/jpeg;charset=utf-8;base64, ' + photo.base64String
            photos.push(photo)
            const container = self.shadowRoot.querySelector('#photo-container')

            container.appendChild(img)
          } catch (e) {
            console.warn('User cancelled', e)
          }
        })


      self.shadowRoot.querySelector('#publish-photo').addEventListener('click', async function (e) {
        const response = await this.$tiki.capture.publish(photos)
      })
      self.shadowRoot.querySelector('#register-address').addEventListener('click', async function (e) {
        try {
          await this.$tiki.auth.registerAddress(providerId, pubKey, userId)

        } catch (e) {
          console.warn('User cancelled', e)
        }
      })
      self.shadowRoot.querySelector('#create-license').addEventListener('click', async function (e) {
        try {
          await this.$tiki.license.create('token', samplePostLicenseRequest)

        } catch (e) {
          console.warn('User cancelled', e)
        }
      })
      self.shadowRoot.querySelector('#get-license').addEventListener('click', async function (e) {
        try {

          await this.$tiki.license.get('ansduashduasd')

        } catch (e) {
          console.warn('User cancelled', e)
        }
      })
      self.shadowRoot.querySelector('#verify-license').addEventListener('click', async function (e) {
        try {

          await this.$tiki.license.guard(sampleGuardRequest)

        } catch (e) {
          console.warn('User cancelled', e)
        }
      })
      self.shadowRoot.querySelector('#initialize-client').addEventListener('click', async function (e) {
        try {
          await this.$tiki.initialize(providerId, pubKey, userId)

        } catch (e) {
          console.warn('User cancelled', e)
        }
      })
      self.shadowRoot.querySelector('#scan-method').addEventListener('click', async function (e) {
        try {

          await this.$tiki.scan(providerId, userId, pubKey)

        } catch (e) {
          console.warn('User cancelled', e)
        }
      })
    }
  },
)

window.customElements.define(
  'capacitor-welcome-titlebar',
  class extends HTMLElement {
    constructor() {
      super()
      const root = this.attachShadow({ mode: 'open' })
      root.innerHTML = `
    <style>
      :host {
        position: relative;
        display: block;
        padding: 15px 15px 15px 15px;
        text-align: center;
        background-color: #73B5F6;
      }
      ::slotted(h1) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 0.9em;
        font-weight: 600;
        color: #fff;
      }
    </style>
    <slot></slot>
    `
    }
  },
)
