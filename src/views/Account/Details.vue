<template>
  <div>
    <h1>Details</h1>
    <p class='grey--text'>View and edit your personal details related to your Bitter account.</p>
    <v-divider class='mb-4'></v-divider>

    <v-form>

      <v-text-field box
        label='Username'
        color='accent'
        append-icon='person'
        required
        readonly
        :value='user.username'>
      </v-text-field>

      <v-text-field box
        label='Email'
        color='accent'
        append-icon='email'
        required
        readonly
        :value='user.email'>
      </v-text-field>

      <v-text-field box
        label='Date registered'
        color='accent'
        append-icon='date_range'
        required
        readonly
        :value='dateCreated'>
      </v-text-field>

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
