<template>
  <div class='mt-0' v-if='replies(postId)' style='cursor:pointer' title='Click to view replies'>
    <Post v-for='reply in replies(postId)' :key='reply.id' :post='reply' view='Reply' @click.native='$emit("click", reply)'/>

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
  props: {
    postId: String
  },
  components: { Post },
  data() {
    return {
      loading: false,
      canLoadMore: true
    }
  },
  computed: {
    ...mapGetters(['replies'])
  },
  methods: {
    ...mapActions({
      fetchReplies: FETCH_REPLIES
    }),
    async loadMore() {
      if (this.loading || !this.canLoadMore) return false // Currently loading replies, or can't load more, so return false
      else if (this.replies(this.postId).length < 10) return this.canLoadMore = false // No more replies to be loaded
      else if (this.canLoadMore && getScrollPercent(document.querySelector('.timeline-modal')) >= 90) {
        this.loading = true
        let repliesLength = await this.fetchReplies({ postId: this.postId, loadMore: true })
        if (repliesLength < 10) this.canLoadMore = false
        this.loading = false
      }
    }
  },
  watch: {
    postId: async function (newVal, oldVal) {
      if (newVal !== oldVal) {
        await this.fetchReplies({ postId: this.postId })
        this.$forceUpdate()
      }
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
