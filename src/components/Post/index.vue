<template>
  <v-card>
    <v-card-title :class='{ "py-2": view === "Timeline" || "Reply", "py-3": view === "Focused" }'>
      <span :class='{
        "subheading": view === "Timeline",
        "title": view === "Focused"
        }' class='font-weight-bold'>{{ post.author.username }}</span>
      <span class='caption accent--text ml-2'>{{ new Date(post.dateCreated) | moment("from") }}</span>

      <v-spacer></v-spacer>

      <v-btn round color='primary' class='ma-0'
        v-if='view === "Focused" && post.author.id !== $store.state.user.data.id' 
        :outline='!post.author.isFollowing'
        @click='() => { toggleFollow(post.author.id); post.author.isFollowing = !post.author.isFollowing }'>
        Follow
      </v-btn>

    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class='pt-2 pt-0' :class='{ "pb-2": view === "Reply" }'>
      <span v-if='post.type === "PostReply"' class='accent--text' :class='{ "caption": view === "Reply" }'>
        replying to {{ post.body.replyingTo.author.username }}
      </span>

      <p class='pt-2 mb-1' :class='{ "title font-weight-regular my-2": view === "Focused" }'>{{ post.body.message }}</p>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions :class='{ "py-1": view === "Reply" }'>

      <v-btn small flat color='accent' title='View Replies'>
        <v-icon left :small='view === "Reply"'>list</v-icon>
        {{ post.stats.replies }}
      </v-btn>

      <v-btn small flat color='accent' title='Repost'>
        <v-icon left :small='view === "Reply"'>arrow_forward</v-icon>
        {{ post.stats.reposts }}
      </v-btn>

      <v-btn small flat :color='post.hasLiked ? "primary" : "accent"' title='Dislike' @click.stop.native='likePost()'>
        <v-icon left :small='view === "Reply"'>thumb_down</v-icon>
        {{ post.stats.likes }}
      </v-btn>

    </v-card-actions>

    <v-divider class='grey darken-4'></v-divider>

  </v-card>
</template>

<script>

import { mapActions } from 'vuex'
import { TOGGLE_POST_LIKE, TOGGLE_USER_FOLLOW } from '@/store/actions.type'

export default {
  name: 'Post',
  props: {
    post: Object, // Preloaded Post Object
    depth: { // depth of post
      type: Number,
      default: 0
    },
    view: 'Timeline' | 'Focused' | 'Reply', // How to display the post
    index: Number
  },
  methods: {
    ...mapActions({
      toggleLike: TOGGLE_POST_LIKE,
      toggleFollow: TOGGLE_USER_FOLLOW
    }),
    // Likes a post
    async likePost() {
      await this.toggleLike(this.post.id)
      this.post.hasLiked = !this.post.hasLiked
      this.post.hasLiked ? this.post.stats.likes++ : this.post.stats.likes--
    }
  }
}
</script>