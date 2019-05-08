<template>
  <v-btn flat small
    title='Like'
    :color='hasLiked ? "primary" : "secondary"'
    @click.stop='likePost()'>
    <v-icon left>thumb_up</v-icon>
    <span>{{ count }}</span>
  </v-btn>
</template>

<script>
import { mapActions } from 'vuex'
import { TOGGLE_POST_LIKE } from '@/store/actions.type'

export default {
  props: {
    hasLiked: Boolean,
    postId: String,
    count: Number
  },
  methods: {
    ...mapActions({
      toggleLike: TOGGLE_POST_LIKE
    }),
    likePost() {
      this.toggleLike(this.postId)
      this.$emit('click')
    }
  }
}
</script>