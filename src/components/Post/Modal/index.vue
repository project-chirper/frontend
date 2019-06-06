<template>
	<v-card v-if='loading' class='pa-2 text-xs-center'>
  	<v-progress-circular class='ma-0 primary--text' indeterminate></v-progress-circular>
	</v-card>

  <div v-else>

    <!-- Previously Loaded Posts -->
    <div class='mb-0' v-if='parentPostIds.length' style='cursor:pointer' title='Click to view replies'>
      <Post v-for='(postId, index) in parentPostIds' :key='postId' :postId='postId' view='Reply' @click.native='changeFocus({ postId, index })'/>
    </div>

    <Post v-if='postId' :postId='postId' view='Focused' :class='{ 
      "border-top": parentPostIds.length,
      "border-bottom": post.stats.replies > 0
    }'/>

    <!-- Replies -->
    <Replies v-if="postId" :postId='postId' @click='(replyId) => changeFocus({ postId: replyId })'/>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Post from '../index'
import Replies from './Replies'

export default {
  components: {
    Post, Replies
  },
  props: {
    focusedPost: String // Post ID, can be empty string ""
  },
  data() {
    return {
      parentPostIds: [], // Post IDs of parent posts e.g replyingTo
      loading: false, // Controls loading circle
      postId: false // Currently in-focus post
    }
  },
  computed: {
    ...mapGetters({
      getPost: 'post'
    }),
    post: function() {
      return this.getPost(this.postId)
    }
  },
  methods: {
    changeFocus({ postId, index = -1, clearParents = false }) {
      if (this.loading) return false; else this.loading = true // If we are loading, return false. Else begin loading

      // If there is currently a focused post, push it to parents
      if (clearParents) this.parentPostIds = []
      else if (this.postId && index < 0) this.parentPostIds.push(this.postId)
      else if (index >= 0) this.parentPostIds.splice(index, this.parentPostIds.length-index)

      this.postId = postId // Set new postId
      this.loading = false // finish loading

      // If parentPostIds are empty but the current post has a replyingTo field, add it to parentPostIds.
      if(this.parentPostIds.length === 0 && this.post.body.replyingTo) this.parentPostIds.push(this.post.body.replyingTo.id)

      history.pushState({}, null, `/user/${this.post.author.username}/post/${postId}`)
      //this.$router.push(`/user/${this.post.author.username}/post/${postId}`)
      document.title = `${this.post.author.username}: ${this.post.body.message}`
    }
  }, 
  watch: {
    focusedPost: function(newVal, oldVal) {
      if(newVal) this.changeFocus({ postId: newVal, clearParents: true })
    }
  }
}

</script>

<style lang="scss" scoped>
.border-top { border-top: 2px solid #FF2667 !important; }
.border-bottom { border-bottom: 2px solid #FF2667 !important; }
</style>