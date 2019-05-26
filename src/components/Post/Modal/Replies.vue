<template>
  <div class='mt-0' v-if='replies.length' style='cursor:pointer' title='Click to view replies'>
    <Post v-for='reply in replies' :key='reply.id' :post='reply' view='Reply' @click.native='$emit("click", reply)'/>

    <div class='text-xs-center'>
      <v-progress-circular v-if='loading' indeterminate class='primary--text my-5'></v-progress-circular>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { FETCH_REPLIES } from '@/store/actions.type'

import getScrollPercent from '@/common/getScrollPercent'

import Post from '../index'

export default {
  props: {
    postId: String
  },
  components: { Post },
  data() {
    return {
      loading: false,
      canLoadMore: true,
      replies: []
    }
  },
  methods: {
    ...mapActions({
      fetchReplies: FETCH_REPLIES
    }),
    async loadMore() {
      if (this.loading || !this.canLoadMore) return false // Currently loading replies, or can't load more, so return false
      else if (this.replies.length < 10) return this.canLoadMore = false // No more replies to be loaded
      else if (getScrollPercent(document.querySelector('.timeline-modal')) >= 90) {
        await this.loadReplies({ loadMore: true })
      }
    },
    /**
     * @desc Loads replies
     * @param loadMore whether to load more or not
     */
    async loadReplies({ loadMore = false }) {
      if (loadMore && !this.canLoadMore) return false
      this.loading = false
      let repliesLength = this.replies.length
      this.replies = [] // empty replies whilst we wait
      this.replies = await this.fetchReplies({ postId: this.postId, loadMore })
      this.loading = false
      if (this.replies.length-repliesLength < 10) this.canLoadMore = false
    }
  },
  watch: {
    postId: async function (newVal, oldVal) {
      await this.loadReplies({ loadMore: false })
    }
  },
  mounted() {
    document.querySelector('.timeline-modal').addEventListener('scroll', this.loadMore)
  },
  beforeDestroy() {
    //document.querySelector('.timeline-modal').removeEventListener('scroll', this.loadMore)
  }
}
</script>
