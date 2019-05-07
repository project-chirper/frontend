import ApiService from './api.service'

export default {
  /**
   * @desc Fetches a fresh timeline
   * @return { ok, data }
   */
  async fetchTimeline(offset = 0, firstPostId) {
    let { data, status } = await ApiService.query('post/timeline', { offset, firstPostId })
    return { ok: status === 200, data }
  },
  /**
   * @desc Fetches updates to previously fetched timeline
   * @param lastPostId the first post in the previously fetched timeline
   * @return { ok, data }
   */
  async fetchUpdates(lastPostId) {
    let { data, status } = await ApiService.query('post/timeline/new', { lastPostId })
    return { ok: status === 200, data }
  },
  /**
   * @desc Likes a post
   * @param postId Post ID to like
   * @return true/false
   */
  async likePost(postId) {
    let { status } = await ApiService.put(`post/${postId}/like`)
    return status === 200
  },
  /**
   * @desc Fetches replies of a post
   * @param postId Post to fetch replies of
   */
  async fetchReplies(postId) {
    let { status, data } = await ApiService.get(`post/${postId}/replies`)
    return { ok: status === 200, data }
  }
}