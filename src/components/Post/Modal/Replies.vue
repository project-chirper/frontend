<template>
  <div class='mt-0' style='cursor:pointer' title='Click to view replies'>
    <Post v-for='replyId in replies' :key='replyId' :postId='replyId' view='Reply' @click.native='$emit("click", replyId)'/>
    <div class='text-xs-center'>
      <v-progress-circular v-if='loading' indeterminate class='primary--text my-5'></v-progress-circular>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { FETCH_REPLIES } from '@/store/actions.type'

import getScrollPercent from '@/common/getScrollPercent'

import Post from '../index'

export default {
  components: { Post },
  props: {
    postId: String // Post ID, will always be a value
  },
  data() {
    return {
      loading: false, // controls loading circle,
      canLoadMore: true // controls whether we can load more or not
    }
  },
  computed: {
    ...mapGetters({
      getReplies: 'replies'
    }),
    replies: function() {
      return this.getReplies(this.postId)
    }
  },
  methods: {
    ...mapActions({
      fetchReplies: FETCH_REPLIES
    }),

    async loadReplies({ loadMore = false } = {}) {
      if (loadMore && !this.canLoadMore) return false // We can not load any more replies.
      this.loading = true // Begin loading
      // Fetch a new/more/updated reply block
      let replyCount = await this.fetchReplies({ postId: this.postId, loadMore })
      this.loading = false // Finish loading
      if (replyCount < 10 && loadMore) this.canLoadMore = false // If we load more replies less than 10, then there must be no more left to load
    },

    async loadMore() {
      if (this.loading || !this.canLoadMore) return false // Cannot load more, or already loading
      else if(getScrollPercent(document.querySelector('.timeline-modal')) >= 90) await this.loadReplies({ loadMore: true })
    }
  },
  watch: {
    postId: async function(newVal, oldVal) {
      if (newVal) await this.loadReplies()
    }
  },
  async beforeMount() {
    await this.loadReplies()
  },
  mounted() {
    // Add an event listener on scroll to load more as user scrolls to bottom of page
    document.querySelector('.timeline-modal').addEventListener('scroll', this.loadMore)
  },
  beforeDestroy() {
    let elem = document.querySelector('.timeline-modal')
    if (elem) elem.removeEventListener('scroll', this.loadMore) // Remove event listener
  }
}
</script>