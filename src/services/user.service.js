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
  }
}