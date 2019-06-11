import ApiService from './api.service'

export default {

  /**
   * @desc Fetches a user's public data
   * @param username The username of user
   * @return ok: true/false, data (user public data)
   */
  async fetchUser(username) {
    let { status, data } = await ApiService.get(`user/${username}`)
    return { ok: status === 200, data }
  },

  /**
   * @desc Follows a user
   * @param userId The user id to follow
   * @return True if successful, false otherwise
   */
  async followUser(userId) {
    let { status } = await ApiService.put(`user/${userId}/follow`)
    return status === 200
  },

  async checkEmailVerification(uniqueCode) {
    let { status } = await ApiService.get(`user/verify-email/${uniqueCode}`)
    return status === 200
  },

  // Search for a user
  async searchUser(username, offset = 0) {
    let { status, data } = await ApiService.query('user/search-user', { username, offset })
    return { ok: status === 200, data }
  },

  // Edit display info
  async editDisplayInfo(editedFields) {
    try {
      let { status, data } = await ApiService.put('user/display-info', editedFields)
      return { ok: status === 200, data }
    } catch (err) {
      if (err.response.status === 422) return { ok: 0, errors: err.response.data.errors }
      else throw (err)
    }
  }
}