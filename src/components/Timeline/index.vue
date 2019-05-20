<template>
  <div>
    <div>
      <v-btn round flat class='primary'>
        Make a post
        <v-icon right>publish</v-icon>
      </v-btn>
      <v-btn outline round color='tertiary' @click='fetchUpdates()'>
        Fetch New Posts
        <v-icon right>refresh</v-icon>
      </v-btn>

      <v-divider class='mt-2 mb-4'></v-divider>
    </div>

    <v-dialog full-width width='700' v-model='dialog' class='mb-5' content-class='timeline-modal'>
      <div slot='activator'>
        <Post 
          v-for='(post, index) in posts' 
          :key='post.id'
          :post='post' 
          type='Timeline'
          :index='index'
          @click.stop.native='changeFocus(post)'
        />
      </div>
      <Modal :focusedPost='focusedPost'/>
    </v-dialog>

    <div class="text-xs-center my-5" v-if='loading'>
		  <v-progress-circular indeterminate class='primary--text'></v-progress-circular>
    </div>

  </div>
</template>

<script>
import PostService from '@/services/post.service'

import { mapActions } from 'vuex'

import { 
  FETCH_TIMELINE, 
  FETCH_TIMELINE_UPDATES, 
  FETCH_POST 
} from '@/store/actions.type'

import Post from '@/components/Post'
import Modal from '@/components/Post/Modal'

import getScrollPercent from '@/common/getScrollPercent'

export default {
  components: {
    Post, Modal
  },
  props: {
    from: { // Where to display posts from. If 'public', then it will show users public timeline. If user ID, it will show that users posts.
      type: String,
      default: 'public'
    },
    linkedToPost: { // If user timeline, this will be the ID of the linked to focused post
      type: String | Boolean,
      default: false
    }
  },
  data() {
    return {
      focusedPost: {}, // currently focusedPost in modal
      dialog: false, // controls modal toggle,
      loading: false, // controls loading circle
      canLoadMore: true, // Whether you can load more or not

      posts: [] // current posts
    }
  },
  methods: {
    ...mapActions({
      fetchTimeline: FETCH_TIMELINE,
      fetchUpdates: FETCH_TIMELINE_UPDATES,
      fetchPost: FETCH_POST
    }),
    changeFocus(post) { // changes the current modal post
      this.focusedPost = post
      this.dialog = true // manually opens modal
    },
    /**
     * @desc Load posts
     * @param loadMore whether to load more posts or not
     * @returns Updates posts array
     */
    async loadPosts({ loadMore = false, updates = false }) {
      if (loadMore && !this.canLoadMore) return false
      this.loading = true
      let postsLength = this.posts.length
      this.posts = updates ? await this.fetchUpdates(this.from) : await this.fetchTimeline({ author: this.from, loadMore })
      this.loading = false
      if (this.posts.length-postsLength < 25) this.canLoadMore = false
    },
    /**
     * @desc Loads more posts as user scrolls down the timeline
     * @return Adds newly loaded posts to posts array
     */
    async loadMore() {
      if (this.loading) return false // Return false if we are already loading posts
      else if (this.posts.length < 25) return this.canLoadMore = false // If there are less than 25 posts, there are none more to load
      else if (getScrollPercent() >= 90) { // If we have more posts to load and user has scrolled the appropriate amount
        await this.loadPosts({ loadMore: true })
      }
    },
    /**
     * @desc Sets the linked to post to the focused post
     */
    async setLinkedToPost() {
      console.log("hi")
      // Find if linked to post is already loaded
      let matchedPost = this.posts.filter(post => post.id === this.linkedToPost)[0]
      this.focusedPost = matchedPost ? matchedPost : await this.fetchPost(this.linkedToPost)
      this.dialog = true // Manually open focused post
    }
  },
  watch: {
    /**
     * @desc Watches the dialog status to change the URL appropriately
     */
    dialog: function(newVal, oldVal) {
      if (newVal === false) { // If the modal has been closed
        history.pushState({}, null, 
          this.from === 'public' ? '/' : `/user/${this.focusedPost.author.username}` // if viewing public, set to blank. If viewing a users posts, set to the user's profile url
        ) // reset URL when user clicks off post modal
        this.focusedPost = {} // Reset focused post to blank
      }
    },
    /**
     * @desc Watches from prop so it can load the appropriate timeline
     * @return Updates posts array to respective posts
     */
    from: async function(newVal, oldVal) {
      this.posts = await this.fetchTimeline({ author: this.from }) // Fetch new posts
    },
  },
  /**
   * @desc Load timeline for the first time
   */
  async beforeMount() {
    await this.loadPosts({ updates: this.posts.length }) // load timeline and fetch updates if timeline already loaded
    if (this.linkedToPost) await this.setLinkedToPost()

    // Add event listener for scrolling to check updates
    document.addEventListener('scroll', this.loadMore)
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.loadMore) // remove event listener on destroy
  }
}
</script>