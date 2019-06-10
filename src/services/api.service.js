import Vue from 'vue'
// import VueApp from '../main'
import router from '../router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import JwtService from '../services/jwt.service'
import store from '../store';
import { PURGE_AUTH } from '../store/mutations.type';

function handleResponse(response) {
  switch(response.status) {
    case 401:
      store.commit(PURGE_AUTH)
      router.push({ name: 'login' })
      return true
    case 404:
      router.push('/404')
      return true
    case 500:
      alert('500 Internal Server Error')
      return true
  }

  return false
}

export default {
  init() {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = process.env.VUE_APP_API // '/api'
    // Error handling
    Vue.axios.interceptors.response.use(
      res => res, // response handler
      err =>  { // error handler
        if (err.response && handleResponse(err.response)) return Promise.resolve(err.response) 
        else if (!err.response && err.request) alert("Could not connect to API gateway")
        return Promise.reject(err)
      }
    )
  },

  /**
   * @desc Sets authorization header on Axios
   */
  setHeader() {
    Vue.axios.defaults.headers.common['x-access-token'] = JwtService.getToken()
  },

  // Performs a query request to specified resource
  async query(resource, params) {
    return await Vue.axios.get(resource, { params })
  },
  // Performs a get request
  async get(resource) {
    return await Vue.axios.get(resource)
  },
  // Performs a post request to the specified resource and takes in params
  async post(resource, params) {
    return await Vue.axios.post(resource, params)
  },
  // Performs a put request to the specified resource and takes in params
  async put(resource, params) {
    return await Vue.axios.put(resource, params)
  },
  // Performs a delete request
  async delete(resource) {
    return await Vue.axios.delete(resource)
  }
}