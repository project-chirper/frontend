<template>
  <div>
    <Post v-for='post in timeline' :key='post.id' :post='post'/>
  </div>
</template>

<script>
import PostService from '@/services/post.service'
import { mapGetters, mapActions } from 'vuex'
import { FETCH_TIMELINE, FETCH_UPDATES } from '@/store/actions.type'

import Post from '@/components/Post'

export default {
  components: {
    Post
  },
  methods: {
    ...mapActions({
      fetchTimeline: FETCH_TIMELINE,
      fetchUpdates: FETCH_UPDATES
    })
  },
  computed: {
    ...mapGetters([ 'timeline' ])
  },
  beforeMount() {
    if (!this.timeline.length) this.fetchTimeline()
    if (this.timeline.length) this.fetchUpdates()
  }
}
</script>