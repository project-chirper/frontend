<template>
  <div>
    <v-dialog width='700' full-width>
      <Base :post='post' @loadReplies='loadReplies()' slot='activator'/>
      <Modal :post='post' :replies='replies'/>
    </v-dialog>

		<div>{{ post.replies }}</div>
  </div>
</template>

<script>
import Base from './Base'
import Modal from './Modal'

import { mapActions } from 'vuex'
import { FETCH_REPLIES } from '@/store/actions.type'

export default {
  name: 'Post',
  props: {
    post: Object,
    depth: { // depth of post
      type: Number,
      default: 0
    }
  },
  components: {
    Base, Modal
  },
  data() {
    return {
      replies: []
    }
  },
  methods: {
    ...mapActions({
      fetchReplies: FETCH_REPLIES
    }),
    async loadReplies() {
      this.replies = await this.fetchReplies(this.post.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.reply-link {
  position:relative;
  &::after {
    content:'';
    position:absolute;
    width:10px;height:50%;
    background-color:#FF5656;
    top:75%;left:-20px;
    border-radius:20px !important
  }
}
</style>
