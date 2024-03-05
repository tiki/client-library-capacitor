<template>
  <div class="hello">
    <span @click="clickTest">Click me</span>
  </div>
</template>

<script>
import { TikiClient } from '@mytiki/publish-client-capacitor';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    clickTest: () => TikiClient.initialize("newUser")
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
