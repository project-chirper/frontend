<template>
  <v-btn flat small
    title='Like'
    :color='hasLiked ? "primary" : "secondary"'
    @click.stop='$emit("click")'>
    <v-icon left>thumb_up</v-icon>
    <span>{{ count }}</span>
  </v-btn>
</template>

<script>
export default {
  props: {
    hasLiked: Boolean,
    count: Number
  }
}
</script>