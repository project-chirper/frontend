import ApiService from './api.service'

export default {
  /**
   * @desc Sends login request with user credentials
   * @return Error message or user data
   */
  async login(credentials) {
    try {
      let { data } = await ApiService.post('user/login', credentials)
      return { ok: 1, data }
    } catch (err) {
      if (err.response.status === 422) return { ok: 0, errors: err.response.data.errors }
      else throw(err)
    }
  },

  /**
   * @desc Sends register request with user credentials
   * @return Validation errors or user data
   */
  async register(credentials) {
    try {
      let { data } = await ApiService.post('user/register', credentials)
      return { ok: 1, data }
    } catch (err) {
      if (err.response.status === 422) return { ok: 0, errors: err.response.data.errors }
      else throw(err)
    }
  }
}