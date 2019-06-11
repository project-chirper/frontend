import { mapActions } from 'vuex'

export default {
  install (Vue, options) {
    Vue.mixin({
      methods: {
        ...mapActions('ping', ['setNotification']),
        ping(params) {
          this.setNotification(params)
        }
      }
    })
  }
}