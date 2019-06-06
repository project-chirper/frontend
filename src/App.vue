<template>
  <v-app dark>
    <the-navbar/>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'

export default {
  name: 'App',
  components: { TheNavbar },
  computed: {
    timeline: function() {
      return this.$store.getters.timeline("public")
    }
  }
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