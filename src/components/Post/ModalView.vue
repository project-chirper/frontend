<template>
  <v-card>
    <v-card-title>
      <span class='font-weight-bold headline'>{{ post.author.username }}</span>
      <span class='ml-2 secondary--text'>{{ new Date(post.dateCreated) | moment("from") }}</span>
      <v-spacer></v-spacer>

      <v-btn v-if='$store.state.user.data.id!==post.author.id' round :outline='!post.author.isFollowing' :class='{
        "primary--text": !post.author.isFollowing,
        "primary": post.author.isFollowing
      }' @click='followUser()'>
        {{ post.author.isFollowing ? 'Unfollow' : 'Follow' }}
      </v-btn>

    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <p 
        class="caption secondary--text"
        v-if='post.type==="PostReply"'
      >replying to {{ post.body.replyingTo.author.username }}</p>

      <p class='headline'>{{ post.body.message }}</p>

      <p class='caption'>{{ post.dateCreated | moment("dddd, MMMM Do YYYY") }}</p>

    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { TOGGLE_USER_FOLLOW } from '@/store/actions.type'

export default {
  props: {
    post: Object,
    replies: Array
  },
  methods: {
    ...mapActions({
      toggleFollow: TOGGLE_USER_FOLLOW
    }),
    followUser() {
      this.toggleFollow(this.post.author.id)
      this.post.author.isFollowing = !this.post.author.isFollowing
    }
  }
}
</script>
