<template>
  <div>
    <h1 class='primary--text font-weight-light' :class='{
      "display-2": $vuetify.breakpoint.mdAndDown, 
      "display-4": $vuetify.breakpoint.lgAndUp 
    }'>
      {{ header }}
    </h1>

    <p class='mt-3 font-weight-regular secondary--text' :class='{
      "subheading": $vuetify.breakpoint.mdAndDown,
      "headline": $vuetify.breakpoint.lgAndUp
    }'>
      {{ paragraph }}
    </p>

    <p class='caption secondary--text'>Chirper is a project built for educational purposes by Matthew Lang aka MattL019.</p>
  </div>
</template>

<script>

export default {
  props: {
    type: String // 'login' or 'register'
  },
  computed: {
    header: function() {
      return this.type === 'login' ? 'Welcome back!' : 'Welcome to Chirper!'
    },
    paragraph: function() {
      return this.type === 'login' ?
        'We\'re glad to see you back so soon.' :
        'Chirper is a social network platform. Create, like and share posts. See a timeline of posts from everyone you follow.'
    }
  }
}
</script>
