import ApiService from '../services/api.service'
import AuthService from '../services/auth.service'
import JwtService from '../services/jwt.service'

import {
  LOGIN, LOGOUT, REGISTER, CHECK_AUTH
} from './actions.type'

import {
  SET_AUTH, PURGE_AUTH
} from './mutations.type'

const state = {
  data: {}, // Object to store user data
  isAuthed: !!JwtService.getToken() // Whether the user is authenticated or not
}

const getters = {

}

const actions = {
  /**
   * @desc Sends POST login request to server with credentials
   * @return Error messages or TRUE if succeeded
   */
  async [LOGIN](context, credentials) {
    let response = await AuthService.login(credentials)
    if (response.ok) context.commit(SET_AUTH, response.data)
    return response
  },

  /**
   * @desc Sends POST register request to server with credentials
   * @return Error validation messages or TRUE if succeeded
   */
  async [REGISTER](context, credentials) {
    let response = await AuthService.register(credentials)
    if (response.ok) context.commit(SET_AUTH, response.data)
    return response
  },

  // Logs out the user
  [LOGOUT](context) { context.commit(PURGE_AUTH) },

  /**
   * @desc Checks auth of the user and logs in if possible
   * @return TRUE if success or FALSE if not
   */
  async [CHECK_AUTH](context) {
    if(JwtService.getToken()) {
      ApiService.setHeader()
        let { data, status } = await ApiService.get('user')
        if (status === 200) context.commit(SET_AUTH, data)
    }
    return true
  }
}

const mutations = {
  [SET_AUTH](state, user) {
    state.isAuthed = true
    state.data = user
    JwtService.saveToken(state.data.token)
  },
  [PURGE_AUTH](state) {
    state.isAuthed = false
    state.user = {}
    JwtService.destroyToken()
    ApiService.setHeader() // update auth header with empty token
  }
}

export default {
  state, actions, mutations, getters
}