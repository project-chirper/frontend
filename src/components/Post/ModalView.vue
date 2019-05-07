<template>
  <v-card>
    <v-card-title>
      <span class='font-weight-bold headline'>{{ post.author.username }}</span>
      <span class='ml-2 secondary--text'>{{ new Date(post.dateCreated) | moment("from") }}</span>
      <v-spacer></v-spacer>

      <v-btn round :outline='!post.author.isFollowing' :class='{
        "primary--text": !post.author.isFollowing,
        "primary": post.author.isFollowing
      }'>
        {{ post.author.isFollowing ? 'Unfollow' : 'Follow' }}
      </v-btn>

    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <p 
        class="caption secondary--text"
        v-if='post.type==="PostReply"'
      >replying to {{ post.body.replyingTo.author.username }}</p>

      <p class='headline'>{{ post.body.message }}</p>

    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    post: Object,
    replies: Array
  }
}
</script>
