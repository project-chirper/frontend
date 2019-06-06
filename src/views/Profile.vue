<template>
  <v-container class="px-3 mt-1" :class='{ "mt-5": $vuetify.breakpoint.mdAndUp }' grid-list-xl v-if='user'>
    <v-layout row wrap justify-center>

      <v-flex xs12 md10 lg3>
        <user-info :user-id='user.id' v-if='user.id'/>
      </v-flex>

      <v-flex xs12 md10 lg6 xl4>
        <timeline :from='user.id' v-if='user.id' :linkedPostId='linkedPostId'/>
      </v-flex>

      <v-flex xs12 md10 lg3>
        <bitter-info/>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { FETCH_USER } from '@/store/actions.type'

import Timeline from '@/components/Timeline/'
import UserInfo from '@/components/Profile/UserInfo'
import BitterInfo from '@/components/Profile/BitterInfo'

export default {
  props: {
    username: String, // Username of the currently selected profile
    linkedPostId: String | Boolean // The ID of a linked-post, or false if not present
  },
  components: { Timeline, UserInfo, BitterInfo },
  computed: {
    ...mapGetters({
      getUser: 'user'
    }),
    user: function() {
      return this.getUser(this.username)
    }
  },
  methods: {
    ...mapActions({
      fetchUser: FETCH_USER
    })
  },
  watch: {
    /**
     * @desc Update user public data when username changes
     */
    username: async function (newVal, oldVal) { 
      if (!this.user) await this.fetchUser(this.username) // Fetch user if not already found
      document.title = `Bitter Profile - ${this.user.username}`
    }
  },
  // Load the user before mounting
  async beforeMount() { 
    if (!this.user) await this.fetchUser(this.username) 
  }
}
</script>
