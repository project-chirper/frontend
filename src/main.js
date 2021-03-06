import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'

import './plugins/vuetify'
import ping from './plugins/ping'

// Required imports
import vueMoment from 'vue-moment'
import { CHECK_AUTH } from './store/actions.type'
import ApiService from './services/api.service'

Vue.config.productionTip = false

// use vueMoment for moment library
Vue.use(vueMoment) 
Vue.use(ping) // ping notify plugin

// Initiate the ApiService.
ApiService.init()
// Check if the user has an authentication token (automatic login)
router.beforeEach(async (to, from, next) => {
  await store.dispatch(CHECK_AUTH)
  next()
})

// Instantiate VueApp
export const VueApp = new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
