<template>
  <v-container class="px-3 mt-1" :class='{ "mt-5": $vuetify.breakpoint.mdAndUp }' grid-list-xl>
    <v-layout row wrap justify-center>
      <v-flex xs12 md10 lg3>
        <user-info v-if='$store.state.user.isAuthed'/>
      </v-flex>

      <v-flex xs12 md10 lg8 xl4>
        <timeline/>
      </v-flex>

      <v-flex xs12 md10 lg3>
        <bitter-info/>
      </v-flex>

    </v-layout>

  </v-container>
</template>

<script>
import Timeline from '@/components/Timeline/'
import BitterInfo from '@/components/Profile/BitterInfo'
import UserInfo from '@/components/Profile/UserInfo'

export default {
  components: {
    Timeline, BitterInfo, UserInfo
  }
}
</script>