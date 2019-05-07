<template>
  <div>
    <Post 
      v-if='post.type === "PostReply" && depth===0' 
      :post='post.body.replyingTo' :depth='depth+1'
      class='reply-link'
    />

    <v-dialog width='700' full-width>
      <Base :post='post' @loadReplies='loadReplies()' slot='activator'/>
      <ModalView :post='post' :replies='replies'/>
    </v-dialog>

  </div>
</template>

<script>
import Base from './Base'
import ModalView from './ModalView'

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
    Base, ModalView
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
