<template>
  <v-btn flat small
    title='View replies'
    color='secondary'
    @click='$emit("click")'>
    <v-icon left>list</v-icon>
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
