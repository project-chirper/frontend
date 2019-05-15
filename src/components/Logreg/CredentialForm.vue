<template>
  <v-card>
    <v-card-title class='font-weight-bold'>{{ type.toUpperCase() }}</v-card-title>

    <v-card-text class='pa-0'>
      <v-form v-model='valid' ref='form'>

        <!-- Username -->
        <v-text-field box validate-on-blur
          label='Username'
          color='accent'
          append-icon='person'
          :rules='rules[type].username'
          required
          v-model='formData.username'
          browser-autocomplete='username'
          aria-label='username'>
        </v-text-field>

        <!-- Email -->
        <v-text-field v-if='type === "register"' box validate-on-blur
          label='Email'
          color='accent'
          append-icon='email'
          :rules='rules[type].email'
          required
          v-model='formData.email'
          browser-autocomplete='email'
          aria-label='email'>
        </v-text-field>

        <!-- Password -->
        <v-text-field box validate-on-blur
          label='Password'
          color='accent'
          type='password'
          append-icon='vpn_key'
          :rules='rules[type].password'
          required
          v-model='formData.password'
          browser-autocomplete='password'
          aria-label='password'>
        </v-text-field>

        <!-- Password -->
        <v-text-field v-if='type === "register"' box validate-on-blur
          label='Confirm Password'
          color='accent'
          type='password'
          append-icon='confirmation_number'
          :rules='rules[type].confirmPassword'
          required
          browser-autocomplete='new-password'
          aria-label='new-password'>
        </v-text-field>

        <v-alert :value='errors.length' class='my-3' type='error'>
          <v-chip v-for='error in errors' :key='error' class='error'>{{ error }}</v-chip>
        </v-alert>

        <v-layout row wrap class='px-4'>
          <v-flex xs12 lg8 v-if='type === "register"'>
              <v-checkbox color='secondary' label='Agree to our Terms &amp; Services' required :rules='rules[type].agree'></v-checkbox>
          </v-flex>
          <v-spacer v-else/>

          <v-flex xs12 lg4>
            <v-btn large block color='primary' @click.prevent='submit' type='submit' :loading='submitLoading'>
              <v-icon left>send</v-icon>
              {{ type.toUpperCase() }}
            </v-btn>
          </v-flex>
        </v-layout>

      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { LOGIN, REGISTER } from '@/store/actions.type'

export default {
  props: {
    type: String // login or register
  },
  data() {
    return {
      valid: false, // Controls if form is valid or not
      // Validation rules
      rules: {
        login: {
          username: [ v => !!v || 'Username is required.' ],
          password: [ v => !!v || 'Password is required.' ]
        },
        register: {
          username: [
            v => (v.length >= 5 && v.length <= 25) || 'Username must be between 5-25 characters in length.',
            v => (/^[a-zA-Z0-9_]+$/g).test(v) || 'Username must not contain special characters.'
          ],
          email: [
            v => (/\S+@\S+\.\S+/g).test(v) || 'Email is invalid.',
          ],
          password: [
            v => (v.length >= 5) || 'Password must be at least 5 characters in length. Safety first!'
          ],
          confirmPassword: [
            v => v === this.formData.password || 'Passwords do not match.'
          ],
          agree: [
            v => !!v || "You must agree to continue."
          ]
        }
      },

      // Object that holds all formData
      formData: {
        username: '', email: '', password: ''
      },

      // Controls submit button loading
      submitLoading: false,
  
      // Holds any validation/error messages
      errors: []
    }
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return false // Form isn't valid
      this.submitLoading = true // begin loading
      let response = await this.$store.dispatch(this.type === 'login' ? LOGIN : REGISTER, this.formData)
      
      if (!response.ok) {
        this.submitLoading = false // Stop loading
        return this.errors = response.errors // Errors
      }

      else this.$router.push({ name: 'home' }) // suceed, go home
    }
  },
  watch: { // clear errors on route change
    type: function() { this.errors = [] }
  }
}
</script>