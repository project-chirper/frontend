import ApiService from '../services/api.service'
import AuthService from '../services/auth.service'
import UserService from '../services/user.service'
import JwtService from '../services/jwt.service'

import Cache from '@mattl019/objectset'

import {
  LOGIN, LOGOUT, REGISTER, CHECK_AUTH, 
  TOGGLE_USER_FOLLOW, FETCH_USER
} from './actions.type'

import {
  SET_AUTH, PURGE_AUTH, ADD_USER
} from './mutations.type'

const state = {
  data: {}, // Object to store user data
  isAuthed: !!JwtService.getToken(), // Whether the user is authenticated or not,

  users: new Cache('username'), // { id, username, etc... }
  timelines: new Cache('id')
}

const getters = {
  user: state => username => state.users.get(username)
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
  },

  /**
   * @desc Follows a user
   * @param userId The user id to follow
   * @return True or false
   */
  async [TOGGLE_USER_FOLLOW](context, userId) {
    let response = await UserService.followUser(userId)
    return response
  },

  /**
   * @desc Fetches a user
   * @param username The username of the user to fetch
   * @return Commits user data into cache and returns it, or false if error
   */
  async [FETCH_USER](context, username) {
    // If username is the user
    if (context.state.data.username === username) return context.state.data

    // Check chache for user first
    let user = context.state.users.fetch(username)
    if (user) return user

    let { ok, data } = await UserService.fetchUser(username)

    if (ok) {
      context.commit(ADD_USER, data)
      return data
    }
    else return false
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
  },
  [ADD_USER](state, user) {
    state.users.add(user)
  }
}

export default {
  state, actions, mutations, getters
}