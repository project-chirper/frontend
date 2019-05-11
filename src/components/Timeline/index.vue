<template>
  <div>
    <div>
      <v-btn round class='white--text primary' flat>
        Make a post
        <v-icon right>publish</v-icon>
      </v-btn>
      <v-btn outline round color='primary' @click='fetchUpdates()'>
        Fetch New Posts
        <v-icon right>refresh</v-icon>
      </v-btn>

      <v-divider class='mt-2 mb-4'></v-divider>
    </div>

    <v-dialog full-width width='700' v-model='dialog'>
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

  </div>
</template>

<script>
import PostService from '@/services/post.service'
import { mapGetters, mapActions } from 'vuex'
import { FETCH_TIMELINE, FETCH_UPDATES } from '@/store/actions.type'

import Post from '@/components/Post'
import Modal from '@/components/Post/Modal'

export default {
  components: {
    Post, Modal
  },
  data() {
    return {
      focusedPost: {}, // currently focusedPost in modal
      dialog: false // controls modal toggle
    }
  },
  methods: {
    ...mapActions({
      fetchTimeline: FETCH_TIMELINE,
      fetchUpdates: FETCH_UPDATES
    }),
    changeFocus(post) { // changes the current modal post
      this.focusedPost = post
      this.dialog = true // manually opens modal
    }
  },
  computed: {
    ...mapGetters([ 'timeline' ]) // timeline getter
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
    if (!this.timeline.length) this.fetchTimeline()
    if (this.timeline.length) this.fetchUpdates()
  }
}
</script>