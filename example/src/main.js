import Vue from 'vue'
import App from './App.vue'
import TikiPlugin from "@mytiki/publish-client-capacitor"

Vue.config.productionTip = false

Vue.use(TikiPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
