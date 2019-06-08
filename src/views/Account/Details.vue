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
          <p v-else>Your email address is not verified. Check your email for a verification link.</p>
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
export default {
  computed: {
    user: function() {
      return this.$store.state.user.data
    },
    dateCreated: function() {
      return `${ this.$moment(this.user.dateCreated).format("MMMM Do YYYY")} (${ this.$moment(this.user.dateCreated).fromNow() })`
    }
  }
}
</script>
