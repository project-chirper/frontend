<template>
  <div>
    <div>
      <publisher action='basepost' v-if='self'/>

      <v-btn outline round color='tertiary' @click='loadTimeline()'>
        Fetch New Posts
        <v-icon right>refresh</v-icon>
      </v-btn>

      <v-divider class='mt-2 mb-4'></v-divider>
    </div>

    <v-dialog full-width width='700' v-model='dialog' class='mb-5' content-class='timeline-modal'>
      <div slot='activator'>
        <Post 
          v-for='(postId, index) in timeline' 
          :key='postId'
          :postId='postId'
          view='Timeline'
          :index='index'
          @click.stop.native='changeFocus(postId)'
          @view-reply='(replyId) => changeFocus(replyId)'
        />
      </div>
      <Modal :focusedPost='focusedPost'/>
    </v-dialog>

    <div class="text-xs-center my-5" v-if='loading'>
		  <v-progress-circular indeterminate class='primary--text'></v-progress-circular>
    </div>
    
    <first-post v-if='timeline.length === 0 && self'/>

  </div>
</template>

<script>
import PostService from '@/services/post.service'

import { mapActions, mapGetters } from 'vuex'

import { 
  FETCH_TIMELINE, 
  FETCH_POST
} from '@/store/actions.type'

import Post from '@/components/Post'
import Modal from '@/components/Post/Modal'
import Publisher from '@/components/Post/Publisher'
import FirstPost from '@/components/Profile/FirstPost'

import getScrollPercent from '@/common/getScrollPercent'

export default {
  components: {
    Post, Modal, Publisher, FirstPost
  },
  props: {
    from: { // Which timeline to load (user ID)
      type: String,
      default: 'public'
    },
    linkedPostId: { // linked to post ID
      type: String | Boolean,
      default: false
    }
  },
  data() {
    return {
      focusedPost: "", // the ID of the currently focused post
      dialog: false, // Controls modal toggle
      loading: false, // Controls loading circle
      canLoadMore: true // Whether we can load more timeline posts or not
    }
  },
  computed: {
    ...mapGetters({
      getTimeline: 'timeline',
      getPost: 'post'
    }),
    // Return timeline
    timeline: function() {
      return this.getTimeline(this.from)
    },
    // Return focused post
    post: function() {
       return this.getPost(this.focusedPost)
    },
    // Whether or not own users profile
    self: function() {
      return this.from === "public" || this.from === this.$store.state.user.data.id
    }
  },
  methods: {
    ...mapActions({
      fetchTimeline: FETCH_TIMELINE,
      fetchPost: FETCH_POST
    }),

    // Load initial/more/updated timeline
    async loadTimeline({ loadMore = false } = {}) {
      if (loadMore && !this.canLoadMore) return false // We can not load any more posts.
      this.loading = true // Begin loading
      // Fetch a new/more/updated timeline
      let postCount = await this.fetchTimeline({ from: this.from, loadMore })
      this.loading = false // Finish loading
      if (postCount < 25 && loadMore) this.canLoadMore = false // If we load more posts less than 25, then there must be no more left to load
    },

    // Event listener on 'scroll', triggers to loadMore timeline when scroll is at bottom
    async loadMore() {
      if (this.loading || !this.canLoadMore) return false // We can not load more whilst already loading
      else if (getScrollPercent() >= 90) await this.loadTimeline({ loadMore: true }) // Load more timeline
    },

    // Changes current focusedPost
    changeFocus(postId) {
      this.focusedPost = postId // Switch focusedPost
      this.dialog = true // open dialog
    }
  },
  watch: {
    // Fetches a new timeline when 'from' value changes
    from: async function(newVal, oldVal) {
      if (!this.timeline) await this.fetchTimeline({ author: newVal })
    },
    // change focus whenever linkedPostId is changed
    linkedPostId: function(newVal, oldVal) {
      if(newVal) this.changeFocus(newVal)
    },
    // Set the URL appropriately
    dialog: function(newVal, oldVal) {
      if (newVal === false) { // The modal has been closed
        this.$router.push(
          this.from === 'public' ? '/' : `/user/${this.post.author.username}` // If viewing public, set to root. If viewing a user timeline, set to user's profile URL
        )
        this.focusedPost = "" // Reset focusedPost
      }
    },
    // Fetch post if needed
    focusedPost: async function(newVal, oldVal) {
      if (!this.post && newVal) await this.fetchPost(newVal)
    }
  },
  async beforeMount() {
    await this.loadTimeline() // Load the timeline
    if (this.linkedPostId) this.changeFocus(this.linkedPostId)

    // Add an event listener on scroll to load more as user scrolls to bottom of page
    document.addEventListener('scroll', this.loadMore)
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.loadMore) // Remove event listener
  }
}
</script>