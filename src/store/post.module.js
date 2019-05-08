import PostService from '../services/post.service'

import {
  FETCH_TIMELINE, FETCH_UPDATES, TOGGLE_POST_LIKE, FETCH_REPLIES
} from './actions.type'

import {
  TIMELINE_APPEND, TIMELINE_PREPEND
} from './mutations.type'

const state = {
  timeline: []
}

const getters = {
  timeline: state => {
		return state.timeline
  }
}

const actions = {
  async [FETCH_TIMELINE](context, offset=0) {
    let { ok, data } = await PostService.fetchTimeline(
      offset, 
      context.state.timeline[0] ? context.state.timeline[0].id : undefined
    )
    if (ok) context.commit(TIMELINE_APPEND, data.posts)
    return ok
  },
  async [FETCH_UPDATES](context) {
    if (!context.state.timeline[0]) return false
    let { ok, data } = await PostService.fetchUpdates(context.state.timeline[0].id)
    if (ok) context.commit(TIMELINE_PREPEND, data.posts)
    return ok
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
    })
  }
}

const mutations = {
  [TIMELINE_APPEND](state, posts) {
    state.timeline = state.timeline.concat(posts)
  },
  [TIMELINE_PREPEND](state, posts) {
    state.timeline = posts.concat(state.timeline)
  }
}

export default {
  state, actions, mutations, getters
}