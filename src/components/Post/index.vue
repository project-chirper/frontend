<template>
  <v-card class='grey lighten-5'>

    <v-card-title class='grey lighten-4' :class='{ "py-2": view === "Timeline" || "Reply", "py-3": view === "Focused" }'>
      <span :class='{
        "subheading": view === "Timeline",
        "title": view === "Focused"
        }' class='font-weight-bold'>{{ post.author.username }}</span>
      <span class='caption secondary--text ml-2'>{{ new Date(post.dateCreated) | moment("from") }}</span>

      <v-spacer></v-spacer>

      <v-btn v-if='view === "Focused" && post.author.id !== $store.state.user.data.id' :outline='!post.author.isFollowing' round color='primary' class='ma-0'>
        Follow
      </v-btn>

    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class='pt-2 pt-0' :class='{ "pb-2": view === "Reply" }'>
      <span v-if='post.type === "PostReply"' class='secondary--text' :class='{ "caption": view === "Reply" }'>
        replying to {{ post.body.replyingTo.author.username }}
      </span>

      <p class='pt-2 mb-1' :class='{ "title font-weight-regular my-2": view === "Focused" }'>{{ post.body.message }}</p>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions :class='{ "py-1": view === "Reply" }'>

      <v-btn small flat color='secondary' title='View Replies'>
        <v-icon left :small='view === "Reply"'>list</v-icon>
        {{ post.stats.replies }}
      </v-btn>

      <v-btn small flat color='secondary' title='Repost'>
        <v-icon left :small='view === "Reply"'>arrow_forward</v-icon>
        {{ post.stats.reposts }}
      </v-btn>

      <v-btn small flat :color='post.hasLiked ? "primary" : "secondary"' title='Like' @click.stop.native='likePost()'>
        <v-icon left :small='view === "Reply"'>thumb_up</v-icon>
        {{ post.stats.likes }}
      </v-btn>

    </v-card-actions>

    <v-divider></v-divider>

  </v-card>
</template>

<script>

import { mapActions } from 'vuex'
import { TOGGLE_POST_LIKE } from '@/store/actions.type'

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
      toggleLike: TOGGLE_POST_LIKE
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