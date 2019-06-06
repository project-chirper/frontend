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

    <v-divider v-if='!userId === "self"'></v-divider>
    <v-card-actions class='px-2' v-if='userId === "self"'>
      <v-spacer></v-spacer>
      <follow-btn :userId='user.id' :isFollowing='user.isFollowed'/>
    </v-card-actions>

  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import FollowBtn from './FollowBtn'

export default {
  props: {
    userId: { // ID of the user displaying, self if currently logged in user
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
      return this.userId === 'self' ? this.$store.state.user.data : this.getUser(this.userId)
    },
    stats: function() {
      return [
        { label: `Follower${ this.user.followerCount === 1 ? '' : 's' }`, value: this.user.followerCount },
        { label: 'Following', value: this.user.followingCount }
      ]
    }
  }
}
</script>
