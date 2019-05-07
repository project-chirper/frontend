<template>
  <v-container class="px-3 mt-1" :class='{ "mt-5": $vuetify.breakpoint.mdAndUp }' grid-list-xl>
    <v-layout row wrap justify-space-around>
      <v-flex xs12 md5 xl4 :class='{ "mb-3": $vuetify.breakpoint.xs }'>
        <GreetingBanner :type='action'/>
      </v-flex>
      <v-flex xs12 md5 xl4 :class='{ "mb-5": $vuetify.breakpoint.xs }'>
        <CredentialForm :type='action'/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import GreetingBanner from '@/components/Logreg/GreetingBanner'
import CredentialForm from '@/components/Logreg/CredentialForm'

export default {
  props: {
    action: String
  },
  components: {
    GreetingBanner, CredentialForm
  }
}
</script>
