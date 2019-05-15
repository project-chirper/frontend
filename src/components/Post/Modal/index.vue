<template>
	<v-card v-if='loading' class='pa-2 text-xs-center'>
  	<v-progress-circular class='ma-0 primary--text' indeterminate></v-progress-circular>
	</v-card>

  <div v-else>
    <!-- Previously Loaded Posts -->
    <div class='mb-0' v-if='previousPosts.length' style='cursor:pointer' title='Click to view replies'>
      <Post v-for='(previousPost, index) in previousPosts' :key='previousPost.id' :post='previousPost' view='Reply' @click.native='changeFocus(previousPost, index)'/>
    </div>

    <Post v-if='Object.keys(post).length' :post='post' view='Focused' :class='{ 
      "border-top": previousPosts.length,
      "border-bottom": post.stats.replies > 0
    }'/>

    <!-- Replies -->
    <Replies :postId='post.id' @click='(reply) => changeFocus(reply)'/>

  </div>
</template>

<script>

import Post from '../index'
import Replies from './Replies'

export default {
  props: {
    focusedPost: Object
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
    // Change a reply to the focused post
    async changeFocus(post, index = -1, fromTimeline = false) {
      // IF we are already loading, return false
      if (this.loading) return false
      this.loading = true // start loading
      if (Object.keys(this.post).length) {
        if (index < 0 && !fromTimeline) this.previousPosts.push(this.post)
        else this.previousPosts.splice(index, this.previousPosts.length-index)
      }
      this.post = post // Update focused post
      history.pushState({}, null, `/user/${post.author.username}/post/${post.id}`)
      this.loading = false // end loading
    }
  },
  watch: {
    focusedPost: async function(newVal, oldVal) { // update focused post when changed
      this.previousPosts = []
      if(Object.keys(this.focusedPost).length) {
        await this.changeFocus(newVal, -1, true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.border-top { border-top: 2px solid #3295FF !important; }
.border-bottom { border-bottom: 2px solid #3295FF !important; }
</style>