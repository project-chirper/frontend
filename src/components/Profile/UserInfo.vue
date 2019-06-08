<template>
  <v-card>
    <v-card-title class='primary'>
      <div>
        <p class='title ma-0'>{{ user.username }}</p>
        <p class="body grey--text text--lighten-2 pt-1 ma-0">{{ user.profile.bio }}</p>
        <span v-if='user.followsYou' class='caption tertiary--text'>follows you</span>
      </div>
    </v-card-title>

    <v-card-text class='pa-3'>
        <v-layout row wrap>
          <v-flex v-for='stat in stats' :key='stat.label' shrink>
            <h1 class='display-1 font-weight-bold primary--text'>{{ stat.value }}</h1>
            <span class='grey--text text--lighten-1'>{{ stat.label }}</span>
          </v-flex>
        </v-layout>
    </v-card-text>

    <v-divider></v-divider>
    <v-card-actions class='px-2'>

      <v-tooltip bottom v-if='self'>
        <v-btn color='white' fab small flat slot='activator' router to='/account'>
          <v-icon>settings</v-icon>
        </v-btn>
        <span>Account Settings</span>
      </v-tooltip>

      <v-tooltip bottom v-if='self'>
        <v-btn color='white' fab small flat slot='activator' @click='logout()'>
          <v-icon>exit_to_app</v-icon>
        </v-btn>
        <span>Logout</span>
      </v-tooltip>

      <v-spacer></v-spacer>
      <follow-btn v-if='!self' :userId='user.id' :isFollowing='user.isFollowed'/>
    </v-card-actions>

  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { LOGOUT } from '@/store/actions.type'

import FollowBtn from './FollowBtn'

export default {
  props: {
    username: { // ID of the user displaying, self if currently logged in user
      type: String,
      default: 'self'
    }
  },
  components: { FollowBtn },
  computed: {
    ...mapGetters({
      getUser: 'user'
    }),
    user: function() {
      return this.self ? this.$store.state.user.data : this.getUser(this.username)
    },
    self: function() {
      return this.username === "self" || this.username === this.$store.state.user.data.username
    },
    stats: function() {
      return [
        { label: 'Following', value: this.user.followingCount },
        { label: `Follower${ this.user.followerCount === 1 ? '' : 's' }`, value: this.user.followerCount }
      ]
    }
  },
  methods: {
    ...mapActions({
      logoutUser: LOGOUT
    }),
    logout() {
      this.logoutUser()
      this.$router.push({ name: 'login' })
    }
  }
}
</script>