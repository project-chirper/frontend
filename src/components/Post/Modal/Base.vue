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

      <p class='caption mb-0 secondary--text'>{{ post.dateCreated | moment("dddd, MMMM Do YYYY") }}</p>

    </v-card-text>

    <v-divider/>

    <v-card-actions>
      <ViewRepliesBtn :count='post.stats.replies'/>
      <RepostBtn :count='post.stats.reposts'/>
      <LikeBtn 
        :hasLiked='post.hasLiked'
        :postId='post.id'
        :count='post.stats.likes'
        @click='toggleLike()'
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { TOGGLE_USER_FOLLOW } from '@/store/actions.type'

import LikeBtn from '../Buttons/LikeBtn'
import RepostBtn from '../Buttons/RepostBtn'
import ViewRepliesBtn from '../Buttons/ViewRepliesBtn'

export default {
  props: {
    post: Object
  },
  components: {
    LikeBtn, RepostBtn, ViewRepliesBtn
  },
  methods: {
    ...mapActions({
      toggleFollow: TOGGLE_USER_FOLLOW
    }),
    followUser() {
      this.toggleFollow(this.post.author.id)
      this.post.author.isFollowing = !this.post.author.isFollowing
    },
    toggleLike() {
      this.post.hasLiked = !this.post.hasLiked
      this.post.hasLiked ? this.post.stats.likes++ : this.post.stats.likes--
    }
  }
}
</script>
