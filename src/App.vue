<template>
  <v-app dark>
    <TheNavbar/>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'

export default {
  name: 'App',
  components: {
    TheNavbar
  }
}
</script>

<style lang="scss">
/* turn off min-width for all buttons */
.v-btn {
  min-width: 0;
}
a {
  text-decoration:none;
  cursor:pointer;
}
</style>