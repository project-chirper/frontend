<template>
  <v-container class="px-3 mt-1" :class='{ "mt-5": $vuetify.breakpoint.mdAndUp }' grid-list-xl>
    <v-layout row wrap justify-center>
      <v-flex xs12 md10 lg8 xl4>
        <timeline :from='user.id' v-if='user.id'/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { FETCH_USER } from '@/store/actions.type'

import Timeline from '@/components/Timeline/'

export default {
  props: {
    username: String
  },
  components: { Timeline },
  data() {
    return {
      user: {}
    }
  },
  methods: {
    ...mapActions({
      fetchUser: FETCH_USER
    })
  },
  watch: {
    username: async function (newVal, oldVal) { this.user = await this.fetchUser(newVal) }
  },
  async beforeMount() { if (this.username) this.user = await this.fetchUser(this.username) }
}
</script>
