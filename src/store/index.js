import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// modules
import user from './user.module'
import post from './post.module'
import ping from './ping.module'

export default new Vuex.Store({
  modules: {
    user, post, ping
  }
})