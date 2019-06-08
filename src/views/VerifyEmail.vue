<template>
  <div class='text-xs-center mt-5' v-if='show'>
    <h1 class='display-1'>
      Email Verified 
      <v-icon large class='mb-1'>verified_user</v-icon>
    </h1>

    <p class='mt-3 accent--text'>Thanks for verifying your email. You will be redirected in {{ redirectTimer }} seconds, or click <router-link :to='{ name:"home" }'>here</router-link>.</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { CHECK_EMAIL_VERIFICATION } from '@/store/actions.type'

export default {
  props: {
    uniqueCode: {
      type: String | Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false, // Don't show verified message until actual verified
      redirectTimer: 10
    }
  },
  methods: {
    ...mapActions({
      checkEmailVerification: CHECK_EMAIL_VERIFICATION
    })
  },
  async beforeMount() {
    let verified = await this.checkEmailVerification(this.uniqueCode)
    if (verified) {
      this.show = true // Show verified message
      setInterval(() => {
        this.redirectTimer--
        if (this.redirectTimer === 0) this.$router.push({ name: 'login' })
      }, 1000)
    }
  }
}
</script>
