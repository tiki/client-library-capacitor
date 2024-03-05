import Vue from "vue";
import App from "./App.vue";
import TikiPlugin from "@mytiki/publish-client-capacitor";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

Vue.config.productionTip = false;

Vue.use(TikiPlugin, {
  providerId: "prov-id",
  publicKey: "pubkey",
  companyName: "ACME Inc",
  companyJurisdiction: "Nashville, TN",
  tosUrl: "https://acme.inc/tos",
  privacyUrl: "https://acme.inc/privacy"
})

new Vue({
  render: (h) => h(App),
}).$mount("#app");
