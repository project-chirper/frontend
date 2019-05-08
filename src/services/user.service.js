import ApiService from './api.service'

export default {
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