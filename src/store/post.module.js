import PostService from '../services/post.service'

import Cache from '@mattl019/objectset'

import {
	FETCH_TIMELINE,
	FETCH_TIMELINE_UPDATES, 
	TOGGLE_POST_LIKE, 
  FETCH_REPLIES,
  FETCH_REPLY_UPDATES,
	FETCH_POST
} from './actions.type'

import {
  TIMELINE_APPEND, TIMELINE_PREPEND, REPLIES_APPEND, REPLIES_PREPEND
} from './mutations.type'

const state = {
	timeline: {
    posts: [],
    page: 0,
    firstPostId: undefined
  },
  cache: new Cache("id"),

  replies: new Cache("postId") // { postId (ukey), posts, firstReplyId, page }
}

const getters = {
  timeline: state => {
		return state.timeline.posts
  },
  replies: state => postId => {
    let replies = state.replies.fetch(postId) // get replies for postId
    return replies ? replies.posts : false
  }
}

const actions = {
  /**
   * @desc Fetches the timeline, with the current page.
   * @returns Number of posts fetched, or false if error
   */
  async [FETCH_TIMELINE](context) {
    let { ok, data } = await PostService.fetchTimeline(
      context.state.timeline.page, // current page
      context.state.timeline.firstPostId // first post id fetched
    )
		if (ok) {
      context.commit(TIMELINE_APPEND, data.posts) // append to state
      return data.posts.length
    } else return false
  },
  /**
   * @desc Fetches timeline updates
   * @returns Number of posts fetched, or false if error
   */
  async [FETCH_TIMELINE_UPDATES](context) {
    if (!context.state.timeline[0]) return await context.dispatch(FETCH_TIMELINE) // If there are zero posts, simply try to fetch a new timeline

    let { ok, data } = await PostService.fetchTimelineUpdates(context.state.timeline[0].id)
    if (ok) {
      context.commit(TIMELINE_PREPEND, data.posts)
      return data.posts.length
    } else return false
  },
  /**
   * @desc Toggles the like on a post
   * @param postId The post ID to toggle like for
   * @return True if successful, false if error
   */
  async [TOGGLE_POST_LIKE](context, postId) {
    let ok = await PostService.likePost(postId)
    return ok
  },

  /**
   * @desc Fetches replies for a post
   * @param postId THe post ID to fetch replies for
   * @param loadMore Whether to fetch next page or not
   * @returns Number of replies fetched, or false if error
   */
  async [FETCH_REPLIES](context, { postId, loadMore = false }) {
    let replies = context.state.replies.fetch(postId) // Check cache for reply block
    if (replies && !loadMore) return replies.posts // Reply block found, but no load more, so just return replies
    let { ok, data } = await PostService.fetchReplies(postId, replies.page, replies.firstReplyId)
    if (ok) {
      let posts = data.replies.map(reply => {
        reply.body.replyingTo = data.replyingTo
        return reply
      })
      context.commit(REPLIES_APPEND, { postId, posts })
      return data.replies.length
    } else return false
  },

  /**
   * @desc Fetches reply updates for a post (new replies)
   * @param postId the post id to search reply updates for
   * @returns Number of updated replies fetched, or false if error
   */
  async [FETCH_REPLY_UPDATES](context, postId) {
    let replies = context.state.replies.fetch(postId) // fetch reply block
    if (!replies || !replies.posts[0]) return await context.dispatch(FETCH_REPLIES) // There are no replyblock or zero replies, try to fetch them

    let { ok, data } = await PostService.fetchReplyUpdates(postId, replies.posts[0].id)
    if (ok) {
      let posts = data.replies.map(reply => {
        reply.body.replyingTo = data.replyingTo
        return reply
      })
      context.commit(REPLIES_PREPEND, { postId, posts })
      return data.replies.length
    } else return false
  },
  
	async [FETCH_POST](context, postId) {
		let { ok, data } = await PostService.fetchPost(postId)
		if (ok) return data
		else return false
  },
  

}

const mutations = {
  [TIMELINE_APPEND](state, posts) {
		if (!state.timeline.firstPostId) state.timeline.firstPostId = posts[0].id
		state.timeline.page++ // increase page

    state.timeline.posts = state.timeline.posts.concat(posts) // append to timeline
    state.cache.addMany(posts) // Add to cache
  },
  [TIMELINE_PREPEND](state, posts) {
    state.timeline.posts = posts.concat(state.timeline.posts) // prepend to timeline
    state.cache.addMany(posts) // Add to cache
  },
  [REPLIES_APPEND](state, { postId, posts }) {
    let replies = state.replies.fetch(postId) // current reply block
    if (replies) { // reply block exists
      state.replies.update(postId, {
        ...replies,
        page: replies.page + 1,
        posts: replies.posts.concat(posts)
      })
    } else { // Reply block doesn't exist
      state.replies.add({
        postId,
        page: 1,
        posts,
        firstReplyId: posts[0] ? posts[0].id : undefined
      })
    }
  },
  [REPLIES_PREPEND](state, { postId, posts }) {
    let replies = state.replies.fetch(postId) // current reply block
    state.replies.update(postId, {
      ...replies,
      posts: posts.concat(replies.posts)
    })
  }
}

export default {
  state, actions, mutations, getters
}