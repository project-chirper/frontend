<template>
  <v-app dark>
    <ping/>

    <navbar/>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar/index'
import Ping from '@/components/Ping'

export default {
  name: 'App',
  components: { Navbar, Ping }
}
</script>

<style lang="scss">
// turn off min-width for all buttons
.v-btn {
  min-width: 0;
}
// Underline for links
.link:hover {
  text-decoration:underline;
  cursor:pointer;
}
</style>