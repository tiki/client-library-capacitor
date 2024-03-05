<template>
  <div id="app">
    <main>
      <h1>Welcome to Tiki Client Example App</h1>
      <div>
        <input type="text" placeholder="Type here the User Id" v-model="userId" />
      </div>
      <div>
        <button @click="initialize">Initialize</button>
      </div>
      <div>
        <button @click="scan">Scan</button>
      </div> 
    </main>
  </div>
</template>

<script>
import { TikiClient } from "@mytiki/publish-client-capacitor"
export default {
  name: "App",
  data: function () {
    return { userId: "" };
  },
  methods: {
    initialize: async function(){
      await TikiClient.initialize(this.userId || window.crypto.randomUUID())
    },
    scan: async function(){
      await TikiClient.createLicense()
      await TikiClient.scan()
    }
  }
};

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
input[type='text'] {
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 0.5em;
  padding: 0.35em 0.25em;
  width: 16em;
  margin: 0 0 1.5em 0;
}
button{
  width: 16em;
  margin: 0 0 1.5em 0;
  border: none;
  padding: 0.5em;
  background-color: #00B272;
  color: white;
  border-radius: 0.5em;
}
</style>
