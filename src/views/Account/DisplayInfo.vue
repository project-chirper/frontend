<template>
  <div>
    <h1>Display Info</h1>
    <p class='grey--text'>View and edit your public info related to your Bitter account.</p>
    <v-divider class='mb-4'></v-divider>

    <v-form>
      <div class='mb-4'>
        <v-text-field box
          label='Bio'
          color='accent'
          append-icon='pencil'
          required
          readonly
          :value='user.profile.bio'
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
    }
  }
}
</script>