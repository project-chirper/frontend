<template>
  <v-autocomplete single-line box hide-details
    style='max-width:20%;min-width:200px'
    append-icon='search'
    clearable
    hide-no-data
    placeholder='Search Bitter'
    item-text='username'
    item-value='username'
    :items='items'
    :loading='loading'
    :search-input.sync='search'
    v-model='selectedUsername'>

  </v-autocomplete>
</template>

<script>
import { mapActions } from 'vuex'
import { SEARCH_USER } from '@/store/actions.type'

export default {
  data() {
    return {
      items: [],
      search: '',
      cooldown: false,
      loading: false,
      page: 0,
      canLoadMore: true,
      selectedUsername: ''
    }
  },
  methods: {
    ...mapActions({
      searchUser: SEARCH_USER
    })
  },
  watch: {
    search: function(newVal, oldVal) {
      if (this.loading) return false // If we are already loading or cannot load more, return false
      else if (!newVal) return this.items = []
      
      clearTimeout(this.cooldown) // Clear previous cooldown and begin a new one
    
      this.loading = true

      this.cooldown = setTimeout(async () => {
        this.items = []
        let result = await this.searchUser({ username: newVal }) // Fetch users
        this.items = this.items.concat(result.users)
        this.loading = false // Set loading to false
      }, 1000)
    },
    selectedUsername: function(newVal, oldVal) {
      if (!newVal) return false

      this.$router.push({
        name: 'profile',
        params: { username: newVal }
      })

      // Reset search bar
      this.items = []
      this.selectedUsername = ''
    }
  }
}
</script>
