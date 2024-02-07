import { SplashScreen } from '@capacitor/splash-screen';
import { TikiClient } from 'tiki-publish-client';

window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();

      SplashScreen.hide();

      const root = this.attachShadow({ mode: 'open' });

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
        align-items: center
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
          <p>
            <button class="button" id="take-photo">Take Photo</button>
          </p>
          <div id="photo-container">

          </div>
        </div>
      </main>
    </div>
    `;
    }

    async connectedCallback() {
      const self = this;

      self.shadowRoot
        .querySelector('#take-photo')
        .addEventListener('click', async function (e) {
          try {
            const photo = await TikiClient.scan();
            console.log('teste', photo)
            // const image = self.shadowRoot.querySelector('#image');
            // if (!image) {
            //   return;
            // }
            let img = document.createElement('img');
            img.src = photo.webPath
            
            const container = self.shadowRoot.querySelector('#photo-container')
            console.log(container)
            container.appendChild(img)
          } catch (e) {
            console.warn('User cancelled', e);
          }
        });
    }
  },
);

window.customElements.define(
  'capacitor-welcome-titlebar',
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
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
    `;
    }
  },
);
