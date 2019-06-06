<template>
  <v-dialog width='700' persistent v-model='dialog'>
    <slot slot='activator'>
      <v-btn round flat class='primary'>
        Make a post
        <v-icon right>publish</v-icon>
      </v-btn>
    </slot>

    <v-card>
      <v-card-title class='justify-center'>
        <span class='font-weight-bold title'>{{ title }}</span>
        <v-btn flat absolute right @click='dialog = false' fab small>
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider class='secondary'></v-divider>

      <v-card-text>
        <v-form v-model='valid' ref='messageForm'>
          <v-textarea box auto-grow clearable :counter='maxLength' 
            hint="Don't be too harsh!" 
            :label='action === "postreply" ? `Replying to ${replyingToUsername}` : "Speak your mind"' 
            placeholder='Blah blah blah' 
            append-icon='create'
            :rules='messageRules'
            v-model='message'>
          </v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class='primary' @click='submitPost()' type='submit'>
          {{ submit }}
          <v-icon right>send</v-icon>
        </v-btn>
      </v-card-actions>

      <v-divider class='secondary'></v-divider>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { CREATE_POST } from '@/store/actions.type'

export default {
  props: {
    // 'postreply' is for making a reply to a focused post
    // 'basepost' is for simply making a base post
    // 'repost' is for making a re-post of a post
    action: 'postreply' | 'basepost' | 'repost',
    // If creating a reply or repost, this will be the post ID in queston
    targetPostId: { 
      type: String | Boolean,
      default: false
    },

    replyingToUsername: String // The username of the user replying to
  },
  data() {
    return {
      valid: false, // whether form is valid or not
      maxLength: 140,
      message: '',
      loading: false, // Whether it's loading or not,
      dialog: false // controls publisher dialog status
    }
  },
  computed: {
    messageRules: function() {
      return [
        v => !!v || 'A message is required.',
        v => (v && v.length <= this.maxLength) || `Message must be no more than ${this.maxLength} characters.`,
        v => (v && v.replace(/^\s+|\s+$/g, '').length !== 0) || 'Message must not be all white space.'
      ]
    },
    title: function() {
      switch(this.action) {
        case 'postreply': return "Write a reply"
        case 'basepost': return "Write a post"
        case 'repost': return "Repost this post"
      }
    },
    submit: function() {
      switch(this.action) {
        case 'postreply': return "Post Reply"
        case 'basepost': return "Create Post"
        case 'repost': return "Post Repost"
      }
    }
  },
  methods: {
    ...mapActions({
      createPost: CREATE_POST
    }),
    async submitPost() {
      if (!this.$refs.messageForm.validate()) return false // Form is not valid
      this.loading = true
      let postId = await this.createPost({
        message: this.message,
        targetPostId: this.targetPostId,
        action: this.action
      })

      console.log(`New Post | ${this.action} - ${this.targetPostId} - ${this.message}`, postId) // debugging, remove later

      this.dialog = false // Close dialog
      this.message = '' // Reset dialog

      //history.pushState({}, null, `/user/${this.$store.state.user.data.username}/post/${postId}`)

      
      this.$router.push({ 
        name: 'post', 
        params: { 
          username: this.$store.state.user.data.username,
          linkedPostId: postId
        } 
      })
    }
  }
}
</script>