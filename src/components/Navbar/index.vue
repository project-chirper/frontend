<template>
  <v-toolbar app dense flat color='toolbar'>
    
    <v-toolbar-title class='headline font-weight-light'>
      <router-link to='/' style='text-decoration:none;' class='white--text' title='Home'>
        Bitter
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <search/>

    <v-toolbar-items class='hidden-sm-and-down'>
      <v-btn flat
        v-for='(nav, key) in navListAvailable'
        :key='key'
        router :to='typeof nav.route === "function" ? nav.route() : nav.route'
        :title='nav.desc'
        class='font-weight-bold'
        @click='navClick(nav)'>
        <span>{{ typeof nav.name === 'function' ? nav.name() : nav.name }}</span>
        <v-icon right v-if='nav.icon'>{{ nav.icon }}</v-icon>
      </v-btn>
    </v-toolbar-items>

    <v-menu class='hidden-md-and-up' transition='slide-y-transition' bottom offset-y>
      <v-toolbar-side-icon slot='activator'></v-toolbar-side-icon>

      <v-list>
        <v-list-tile 
          v-for='(nav, key) in navListAvailable' 
          :key='key' 
          router :to='typeof nav.route === "function" ? nav.route() : nav.route' 
          :title='nav.desc' 
          @click='navClick(nav)'
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ typeof nav.name === 'function' ? nav.name() : nav.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { LOGOUT } from '@/store/actions.type'

import Search from './Search'

export default {
  name: 'navbar',
  components: {
    Search
  },
  data() {
    return {
      navListRaw: [
        { name: () => this.$store.state.user.data.username, icon: 'person', route: () => `/user/${this.$store.state.user.data.username}`, requiresAuth: true },
        //{ name: 'Logout', icon: 'exit_to_app', click: 'logout', desc: 'Logout', requiresAuth: true },

        { name: 'Login', route: '/login', desc: 'Login to your account', requiresNoAuth: true },
        { name: 'Register', route: '/register', desc: 'Register an account', requiresNoAuth: true },
      ]
    }
  },
  computed: {
    navListAvailable: function() {
      return this.navListRaw.filter(x => this.guard(x))
    },
  },
  methods: {
    // Resolver
    guard(nav) {
      if (nav.requiresNoAuth) return !this.$store.state.user.isAuthed
      if (nav.requiresAuth) return this.$store.state.user.isAuthed
      return true
    },

    // Controls when a button is clicked
    navClick(nav) {
      if (!nav.click) return false
      switch(nav.click) {
        case 'logout':
          this.$store.dispatch(LOGOUT)
          this.$router.push({ name: 'login' })
          break
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar { background-color: rgba(#212121, .9); /*border-bottom:2px solid #FF2667;*/ }
</style>