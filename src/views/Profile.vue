<template>
  <v-container class="px-3 mt-1" :class='{ "mt-5": $vuetify.breakpoint.mdAndUp }' grid-list-xl>
    <v-layout row wrap justify-center>

      <v-flex xs12 md10 lg3>
        <user-info :user='user' v-if='user.id'/>
      </v-flex>

      <v-flex xs12 md10 lg6 xl4>
        <timeline :from='user.id' v-if='user.id' :linkedToPost='postId'/>
      </v-flex>

      <v-flex xs12 md10 lg3>
        <bitter-info/>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { FETCH_USER } from '@/store/actions.type'

import Timeline from '@/components/Timeline/'
import UserInfo from '@/components/Profile/UserInfo'
import BitterInfo from '@/components/Profile/BitterInfo'

export default {
  props: {
    username: String,
    postId: String | Boolean // Linked to focused post
  },
  components: { Timeline, UserInfo, BitterInfo },
  data() {
    return {
      user: {}
    }
  },
  methods: {
    ...mapActions({
      fetchUser: FETCH_USER
    })
  },
  watch: {
    username: async function (newVal, oldVal) { this.user = await this.fetchUser(newVal) }
  },
  async beforeMount() { if (this.username) this.user = await this.fetchUser(this.username) }
}
</script>
