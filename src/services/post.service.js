import ApiService from './api.service'

export default {
  /**
   * @desc Fetches a fresh timeline
   * @return { ok, data }
   */
  async fetchTimeline(offset = 0, firstPostId, author) {
    console.log("Fetched timeline.")

    let query = author !== 'public' ? `post/author/${author}` : `post/timeline`
    let { data, status } = await ApiService.query(query, { offset, firstPostId })
    return { ok: status === 200, data }
  },
  /**
   * @desc Fetches updates to previously fetched timeline
   * @param lastPostId the first post in the previously fetched timeline
   * @return { ok, data }
   */
  async fetchTimelineUpdates(lastPostId, author) {
    console.log("Fetched timeline updates.")

    if (author) return { ok: false } // not yet available for author
    s
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
  async fetchReplies(postId, offset = 0, firstReplyId) {
    console.log("Fetched replies.")

    let { status, data } = await ApiService.query(`post/${postId}/replies`, { offset, firstReplyId })
    return { ok: status === 200, data }
  },
  /**
   * @desc Fetches updated replies of a post
   * @param postId Post to fetch replies of
   * @param lastReplyId the last fetched reply id
   */
  async fetchReplyUpdates(postId, lastReplyId) {
    console.log("Fetched reply updates.")

    let { status, data } = await ApiService.query(`post/${postId}/replies/new`, { lastReplyId })
    return { ok: status === 200, data }
  },
	/**
	 * @desc Fetches a Post
	 * @param postId Post ID to fetch
	 */
	async fetchPost(postId) {
		let { status, data } = await ApiService.get(`post/${postId}`)
		return { ok: status === 200, data }
	}
}