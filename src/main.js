import Vue from 'vue'
import './plugins/vuetify'
import vueMoment from 'vue-moment'
import App from './App.vue'
import router from './router'
import store from './store/index'

Vue.use(vueMoment)

Vue.config.productionTip = false

import { CHECK_AUTH } from './store/actions.type'
import ApiService from './services/api.service'
ApiService.init()

router.beforeEach(async (to, from, next) => {
  await store.dispatch(CHECK_AUTH)
  next()
})

export const VueApp = new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
