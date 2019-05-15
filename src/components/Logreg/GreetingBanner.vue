<template>
  <div>
    <h1 class='primary--text font-weight-light' :class='{
      "display-2": $vuetify.breakpoint.mdAndDown, 
      "display-4": $vuetify.breakpoint.lgAndUp 
    }'>
      {{ header }}
    </h1>

    <p class='mt-3 font-weight-regular' :class='{
      "subheading": $vuetify.breakpoint.mdAndDown,
      "headline": $vuetify.breakpoint.lgAndUp
    }'>
      {{ paragraph }}
    </p>

    <p class='caption accent--text'>Bitter is a project built for educational purposes by Matthew Lang aka MattL019.</p>
  </div>
</template>

<script>

export default {
  props: {
    type: String // 'login' or 'register'
  },
  computed: {
    header: function() {
      return this.type === 'login' ? 'Welcome back!' : 'Welcome to Bitter!'
    },
    paragraph: function() {
      return this.type === 'login' ?
        'Came for a moan, have you?' :
        'Bitter is a social network platform created solely for people to moan.'
    }
  }
}
</script>
