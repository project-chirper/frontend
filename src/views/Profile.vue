<template>
  <view-wrapper v-if='user'>
    <user-info :username='username' slot="left"/>
    <timeline :from='user.id' v-if='user.id' :linkedPostId='linkedPostId'/>
    <bitter-info slot="right"/>
  </view-wrapper>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { FETCH_USER } from '@/store/actions.type'

import ViewWrapper from '@/components/Base/ViewWrapper'

import Timeline from '@/components/Timeline/'
import UserInfo from '@/components/Profile/UserInfo'
import BitterInfo from '@/components/Profile/BitterInfo'

export default {
  props: {
    username: String, // Username of the currently selected profile
    linkedPostId: String | Boolean // The ID of a linked-post, or false if not present
  },
  components: { Timeline, UserInfo, BitterInfo, ViewWrapper },
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
