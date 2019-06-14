<template>
  <v-dialog class='px-3' width='500' full-width>
    <a class='accent--text' slot='activator'>Forgot your password?</a>
    <v-card>
      <v-card-title>Recover your password</v-card-title>
      <v-divider></v-divider>
      <v-card-text class='pa-0'>
        <v-form v-model='valid'>

          <v-text-field box validate-on-blur
            label='Email'
            color='accent'
            append-icon='email'
            :rules='rules'
            required
            v-model='email'
            browser-autocomplete='email'
            aria-label='email'
            :disabled='submitted'
            placeholder='Enter your account email'>
          </v-text-field>

          <p class='pa-3' v-if='!submitted'>If there is an account linked with your email you will be sent a secure link to reset your password.</p>
          <p v-else class='pa-3'>If there is an account linked with your email you will find a password recovery link in your inbox.</p>

          <v-btn block class='ma-0 primary' type='submit' @click.prevent='submit' :loading='loading' :disabled='submitted'>Recover Password</v-btn>

        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { REQUEST_RECOVER_PASSWORD } from '@/store/actions.type'

export default {
  data() {
    return {
      valid: false, // Controls validity of the form,
      rules: [ // email validation
        v => (/\S+@\S+\.\S+/g).test(v) || 'Email is invalid.',
      ],
      email: '',
      submitted: false, // whether it has been submitted or not
      loading: false // controls loading status of submit button
    }
  },
  methods: {
    ...mapActions({
      recoverPassword: REQUEST_RECOVER_PASSWORD
    }),
    async submit() {
      if (!this.valid) return false

      this.loading = true
      await this.recoverPassword(this.email)
      this.loading = false
      this.submitted = true
    }
  }
}
</script>
