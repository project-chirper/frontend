const state = {
  message: [],
  color: 'primary',
  show: false
}

const getters = {

}

const actions = {
  setNotification({commit}, params) {
    commit('SET_NOTIFICATION', params);
  }
}

const mutations = {
  SET_NOTIFICATION(state, value) {
    state.message = value.message
    state.color = value.color || 'secondary'
    state.show = true
  }
}

export default {
  namespaced: true,
  state, 
  actions, 
  mutations, 
  getters
}