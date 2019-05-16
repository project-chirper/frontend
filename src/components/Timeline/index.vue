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
          v-for='(post, index) in timeline' 
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
import { mapGetters, mapActions } from 'vuex'
import { FETCH_TIMELINE, FETCH_TIMELINE_UPDATES } from '@/store/actions.type'

import Post from '@/components/Post'
import Modal from '@/components/Post/Modal'

import getScrollPercent from '@/common/getScrollPercent'

export default {
  components: {
    Post, Modal
  },
  props: {
    author: {
      type: String | Boolean, // If specified, will load posts only from that author.
      default: false
    }
  },
  data() {
    return {
      focusedPost: {}, // currently focusedPost in modal
      dialog: false, // controls modal toggle,
      loading: false, // controls loading circle
      canLoadMore: true // Whether you can load more or not
    }
  },
  methods: {
    ...mapActions({
      fetchTimeline: FETCH_TIMELINE,
      fetchUpdates: FETCH_TIMELINE_UPDATES
    }),
    changeFocus(post) { // changes the current modal post
      this.focusedPost = post
      this.dialog = true // manually opens modal
    },
    async loadMore() {
      if (this.loading) return false
      else if (this.timeline.length < 25) return this.canLoadMore = false
      else if (this.canLoadMore && getScrollPercent() >= 90) {
        this.loading = true
        let postLength = await this.fetchTimeline(this.author)
        if (postLength < 25) this.canLoadMore = false
        this.loading = false
      }
    }
  },
  computed: {
    ...mapGetters([ 'timeline' ]) // timeline getter,
  },
  watch: {
    dialog: function(newVal, oldVal) {
      if (newVal === false) {
        history.pushState({}, null, '/') // reset URL when user clicks off post modal
        this.focusedPost = {}
      }
    }
  },
  beforeMount() { // load timeline and fetch updates if timeline already loaded
    if (!this.timeline.length) this.fetchTimeline(this.author)
    if (this.timeline.length) this.fetchUpdates(this.author)

    // Add event listener for scrolling to check updates
    document.addEventListener('scroll', this.loadMore)
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.loadMore) // remove event listener on destroy
  }
}
</script>