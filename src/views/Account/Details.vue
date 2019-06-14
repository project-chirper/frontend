<template>
  <div>
    <h1>Details</h1>
    <p class='grey--text'>View and edit your personal details related to your Bitter account.</p>
    <v-divider class='mb-4'></v-divider>

    <v-form>

      <div class='mb-4'>
        <v-text-field box
          label='Username'
          color='accent'
          append-icon='person'
          required
          readonly
          :value='user.username'
          hide-details>
        </v-text-field>
      </div>

      <div class='mb-4'>
        <v-text-field box
          label='Email'
          color='accent'
          append-icon='email'
          required
          readonly
          :value='user.email.address'
          hide-details>
        </v-text-field>

        <div class='mt-3 accent--text'>
          <p v-if='user.email.verified'>Your email address is verified <v-icon color='accent'>verified_user</v-icon></p>
          <p v-else>Your email address is not verified. 
            <a @click='verifyEmail' v-if='!requestedEmail'>Request an email verification link.</a>
            <span v-else class='primary--text'>Email verification link sent. Please check your spam folder if you can not find it.</span>
          </p>
        </div>

      </div>

      <div class='mb-4'>
        <v-text-field box
          label='Date registered'
          color='accent'
          append-icon='date_range'
          required
          readonly
          :value='dateCreated'
          hide-details>
        </v-text-field>
      </div>

    </v-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { REQUEST_EMAIL_VERIFICATION } from '@/store/actions.type'

export default {
  data() {
    return {
      requestedEmail: false
    }
  },
  computed: {
    user: function() {
      return this.$store.state.user.data
    },
    dateCreated: function() {
      return `${ this.$moment(this.user.dateCreated).format("MMMM Do YYYY")} (${ this.$moment(this.user.dateCreated).fromNow() })`
    }
  },
  methods: {
    ...mapActions({
      requestEmailVerification: REQUEST_EMAIL_VERIFICATION
    }),
    verifyEmail() {
      this.requestEmailVerification()
      this.requestedEmail = true
    }
  }
}
</script>
