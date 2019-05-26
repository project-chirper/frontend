<template>
	<v-card v-if='loading' class='pa-2 text-xs-center'>
  	<v-progress-circular class='ma-0 primary--text' indeterminate></v-progress-circular>
	</v-card>

  <div v-else>
    <!-- Previously Loaded Posts -->
    <div class='mb-0' v-if='previousPosts.length' style='cursor:pointer' title='Click to view replies'>
      <Post v-for='(previousPost, index) in previousPosts' :key='previousPost.id' :post='previousPost' view='Reply' @click.native='changeFocus({ post: previousPost, index, chained: true })'/>
    </div>

    <Post v-if='Object.keys(post).length' :post='post' view='Focused' :class='{ 
      "border-top": previousPosts.length,
      "border-bottom": post.stats.replies > 0
    }'/>

    <!-- Replies -->
    <Replies :postId='post.id' @click='(reply) => changeFocus({ post: reply, chained: true })'/>

  </div>
</template>

<script>

import Post from '../index'
import Replies from './Replies'

export default {
  props: {
    focusedPost: Object | String
  },
  components: { Post, Replies },
  data() {
    return {
      previousPosts: [],
      post: {},
      loading: false,
    }
  },
  methods: {
    /**
     * @desc Chanegs the current focused post
     * @param post The post object
     * @param index The current index of the post in previousPosts
     * @param chained Whether or not the post is chained or not
     */
    changeFocus({ post, index = -1, chained = false }) {
      // IF we are already loading, return false
      if (this.loading) return false; else this.loading = true

      // If there is a post
      if (post.id) {
        if (index < 0 && chained) this.previousPosts.push(this.post) // If it has no current index (not in previousPosts) and it's chained, add it to previousPosts
        else if (chained) this.previousPosts.splice(index, this.previousPosts.length-index) // It has an index and is chained, splice it from previousPosts
        else this.previousPosts = [] // It is not chained, thus clear previousPosts completely
      }

      this.post = post // Update focused post, search it if need be

      history.pushState({}, null, `/user/${this.post.author.username}/post/${this.post.id}`)
      this.loading = false // end loading
    }
  },
  watch: {
    focusedPost: async function(newVal, oldVal) { // update focused post when changed
      // Load post
      if (Object.keys(newVal).length) {
        this.changeFocus({ post: newVal })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.border-top { border-top: 2px solid #FF2667 !important; }
.border-bottom { border-bottom: 2px solid #FF2667 !important; }
</style>