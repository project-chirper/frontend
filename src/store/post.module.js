import PostService from '../services/post.service'

import Cache from '@mattl019/objectset'

import {
	FETCH_TIMELINE,
	FETCH_UPDATES, 
	TOGGLE_POST_LIKE, 
	FETCH_REPLIES, 
	FETCH_POST
} from './actions.type'

import {
  TIMELINE_APPEND, TIMELINE_PREPEND
} from './mutations.type'

const state = {
	timeline: [],
	control: {
		page: 0,
		firstPostId: undefined
	},
  cache: new Cache("id")
}

const getters = {
  timeline: state => {
		return state.timeline
  }
}

const actions = {
  async [FETCH_TIMELINE](context) {
    let { ok, data } = await PostService.fetchTimeline(
      context.state.control.page,
      context.state.control.firstPostId
    )
		if (ok) context.commit(TIMELINE_APPEND, data.posts)
    else return false
  },
  async [FETCH_UPDATES](context) {
    if (!context.state.timeline[0]) return false
    let { ok, data } = await PostService.fetchUpdates(context.state.timeline[0].id)
    if (ok) context.commit(TIMELINE_PREPEND, data.posts)
    else return false
  },
  async [TOGGLE_POST_LIKE](context, postId) {
    let ok = await PostService.likePost(postId)
    return ok
  },
  async [FETCH_REPLIES](context, postId) {
    let { ok, data } = await PostService.fetchReplies(postId)
    if (ok) return data.replies.map(reply => {
      reply.body.replyingTo = data.replyingTo
      return reply
    }); else return false
	},
	async [FETCH_POST](context, postId) {
		let { ok, data } = await PostService.fetchPost(postId)
		if (ok) return data
		else return false
	}
}

const mutations = {
  [TIMELINE_APPEND](state, posts) {
		if (!state.control.firstPostId) state.control.firstPostId = posts[0].id
		state.control.page++ // increase page

    state.timeline = state.timeline.concat(posts) // append to timeline
    state.cache.addMany(posts) // Add to cache
  },
  [TIMELINE_PREPEND](state, posts) {
    state.timeline = posts.concat(state.timeline) // prepend to timeline
    state.cache.addMany(posts) // Add to cache
  }
}

export default {
  state, actions, mutations, getters
}