<template>
  <v-btn round flat
    class='ma-0 tertiary--text'  
    :outline='!status' 
    v-if='userId !== $store.state.user.data.id' 
    @click='() => { this.status = !this.status; toggleFollow(userId) }'>
    {{ status ? 'Unfollow' : 'Follow' }}
  </v-btn>
</template>

<script>
import { mapActions } from 'vuex'
import { TOGGLE_USER_FOLLOW } from '@/store/actions.type'

export default {
  props: {
    isFollowing: Boolean,
    userId: String
  },
  data() {
    return {
      status: this.isFollowing
    }
  },
  methods: {
    ...mapActions({
      toggleFollow: TOGGLE_USER_FOLLOW
    })
  }
}
</script>
