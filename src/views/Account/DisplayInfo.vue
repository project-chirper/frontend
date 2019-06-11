<template>
  <div>
    <h1>Display Info</h1>
    <p class='grey--text'>View and edit your public info related to your Bitter account.</p>
    <v-divider class='mb-4'></v-divider>

    <v-form v-model='valid'>
      <div class='mb-4' v-for='field in fields' :key='field.key'>
        <v-text-field box
          :label='field.label'
          color='accent'
          append-icon='pencil'
          :readonly='!editing'
          hide-details
          v-model='formData[field.key]'>
        </v-text-field>
      </div>

      <v-alert :value='errors.length' class='my-3' type='error'>
        <v-chip v-for='error in errors' :key='error' class='error'>{{ error }}</v-chip>
      </v-alert>

      <div class='text-xs-right'>
        <v-btn outline @click='editing = !editing'>
          {{ editing ? 'DISCARD CHANGES' : 'EDIT' }} 
          <v-icon right>edit</v-icon>
        </v-btn>
        <v-btn color='primary' depressed v-if='editing' :loading='loading' @click='submit'>
          Save
          <v-icon right>save</v-icon>
        </v-btn>
      </div>

    </v-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { EDIT_DISPLAY_INFO } from '@/store/actions.type'

export default {
  data() {
    return {
      editing: false, // Controls if currently editing
      valid: false, // Controls if form is valid or not
      fields: [
        {
          label: 'Bio',
          key: 'bio'
        }
      ],
      formData: {
        bio: ''
      },
      loading: false, // Controls loading state
      errors: [] // Array of error messages
    }
  },
  computed: {
    user: function() {
      return this.$store.state.user.data
    }
  },
  methods: {
    ...mapActions({
      editDisplayInfo: EDIT_DISPLAY_INFO
    }),

    // Resets the fields to their actual value
    resetFields() {
      this.errors = []
      for (let field of this.fields) {
        this.formData[field.key] = this.user.profile[field.key]
      }
    },
    async submit() {
      this.loading = true
      let response = await this.editDisplayInfo(this.formData)
      this.loading = false
      if(typeof response === 'object') this.errors = response; else {
        this.editing = false // Error array
        this.ping({
          message: "Display Info updated"
        })
      }
    }
  },
  watch: {
    editing: function (newVal, oldVal) {
      this.resetFields()
    }
  },
  beforeMount() {
    this.resetFields()
  }
}
</script>
