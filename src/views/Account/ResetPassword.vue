<template>
  <view-wrapper>
    <v-form v-model='valid'>

      <h1 class='mb-1'>Reset your password.</h1>
      <p class='accent--text mb-5'>Choose a new, secure and unique password.</p>

      <v-text-field box validate-on-blur
        label='Password'
        color='accent'
        type='password'
        append-icon='vpn_key'
        :rules='rules.password'
        required
        v-model='password'
        browser-autocomplete='password'
        aria-label='password'>
      </v-text-field>

      <v-text-field box validate-on-blur
        label='Confirm Password'
        color='accent'
        type='password'
        append-icon='confirmation_number'
        :rules='rules.confirm'
        required
        browser-autocomplete='new-password'
        aria-label='new-password'>
      </v-text-field>

      <div class='text-xs-right'>
        <v-btn @click.prevent='submit' type='submit' :loading='loading'>Reset Password</v-btn>
      </div>

    </v-form>
  </view-wrapper>
</template>

<script>
import ViewWrapper from '@/components/Base/ViewWrapper'

import { mapActions } from 'vuex'
import { RESET_PASSWORD } from '@/store/actions.type'

export default {
  props: {
    uniqueCode: {
      type: String | Boolean,
      default: false
    }
  },
  components: {
    ViewWrapper
  },
  data() {
    return {
      valid: false, // controls validity of form
      loading: false, // controls loading state,
      password: '',
      rules: {
        password: [ v => (v.length >= 5) || 'Password must be at least 5 characters in length. Safety first!' ],
        confirm: [ v => v === this.password || 'Passwords do not match.' ]
      }
    }
  },
  methods: {
    ...mapActions({
      resetPassword: RESET_PASSWORD
    }),
    async submit() {
      if (!this.valid) return false

      this.loading = true
      let ok = await this.resetPassword({
        password: this.password,
        uniqueCode: this.uniqueCode
      })
      this.loading = false

      if(ok) {
        this.ping({
          message: "Successfully changed password."
        })
        this.$router.push({ name: 'login' }) // redirect to login page
      } else {
        this.ping({
          message: "Password change not successful."
        })
        // should automatically redirect to login page
      }
    }
  }
}
</script>