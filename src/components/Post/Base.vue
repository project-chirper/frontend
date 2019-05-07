<template>
  <v-card :class='{ "grey lighten-4": loadedReply }' slot='activator'>

    <v-card-title class='pt-3 pb-0'>
      <span class='font-weight-bold'>{{ post.author.username }}</span>
      <span class='ml-2 secondary--text'>{{ new Date(post.dateCreated) | moment("from") }}</span>
    </v-card-title>

    <v-card-text class='py-0'>
      
      <span 
        class="caption secondary--text" 
        v-if='post.type==="PostReply"'
      >replying to {{ post.body.replyingTo.author.username }}</span>
      
      
      <p class='mb-1 mt-2'>{{ post.body.message }}</p>
    </v-card-text>

    <v-card-actions class='mt-2'>
      <ViewRepliesBtn :count='post.stats.replies' @click='$emit("loadReplies")'/>
      <RepostBtn :count='post.stats.reposts'/>
      <LikeBtn 
        :hasLiked='post.hasLiked' 
        :count='post.stats.likes'
        @click='likePost()'
      />
    </v-card-actions>

    <v-divider></v-divider>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { TOGGLE_POST_LIKE } from '@/store/actions.type'

import LikeBtn from './Buttons/LikeBtn'
import RepostBtn from './Buttons/RepostBtn'
import ViewRepliesBtn from './Buttons/ViewRepliesBtn'

export default {
  name: 'Post',
  props: {
    post: Object,
    linkColour: String,
    loadedReply: Boolean
  },
  components: { LikeBtn, RepostBtn, ViewRepliesBtn },
  data() {
    return {
      modal: false,
      replies: []
    }
  },
  methods: {
    ...mapActions({
      toggleLike: TOGGLE_POST_LIKE
    }),
    likePost() {
      this.toggleLike(this.post.id)
      this.post.hasLiked = !this.post.hasLiked
      if (this.post.hasLiked) this.post.stats.likes++; else this.post.stats.likes--
    }
  }
}
</script>

<style lang="scss" scoped>
.reply-link {
  position: absolute;
  top:-75px;left:-10px;
  height:150px;width:10px;
  //background-color:#FF5656;
  border-radius:30px !important;

  @media(min-width: 960px) {
    left: -25px;
  }
}
</style>