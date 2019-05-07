<template>
  <v-btn flat small
    title='Repost'
    color='secondary'
    @click.stop='$emit("click")'>
    <v-icon left>arrow_forward</v-icon>
    <span>{{ count }}</span>
  </v-btn>
</template>

<script>
export default {
  props: {
    count: Number
  }
}
</script>
