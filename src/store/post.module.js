import PostService from '../services/post.service'
import Vue from 'vue'

import {
  FETCH_TIMELINE,
  FETCH_REPLIES,
  FETCH_POST,
  CREATE_POST,
  TOGGLE_POST_LIKE
} from './actions.type'

import {
  TIMELINE_SET,
  REPLIES_SET,
  POST_ADD,
  POST_ADD_MANY,
  POST_UPDATE,
  POST_CLEAR
} from './mutations.type'

const state = {
  posts: {}, // { key: id, body, author, ... } regular post cache
  timelines: {}, // { key: 'public' | 'username' (ukey), postIds: [], page, firstPostId }
  replies: {} // { key: postId, postIds: [], firstReplyId, page }
}

const getters = {
  post: state => id => {
    return state.posts[id] ? state.posts[id] : false
  },
  timeline: state => from => {
    return state.timelines[from] ? state.timelines[from].postIds : false
  },
  replies: state => postId => {
    return state.replies[postId] ? state.replies[postId].postIds : false
  }
}

const actions = {
  async [FETCH_TIMELINE](context, { from = 'public', loadMore = false }) {
    // Get current timeline if exists
    let timeline = context.state.timelines[from] ? context.state.timelines[from] : {}

   // Fetch new/more/updated timeline
    let { ok, data } = (timeline.postIds && !loadMore) > 0 ? 
      await PostService.fetchTimelineUpdates(timeline.postIds[0], from) : // Fetch updates
      await PostService.fetchTimeline( // Fetch timeline/load more
        timeline.page,
        timeline.firstPostId,
        from
      )

    if (ok) {
      // If timeline is from a user, append author object to each post object
      if (from !== 'public') data.posts = data.posts.map(post => {
        post.author = data.author
        return post
      })

      let postIds = data.posts.map(post => post.id) // Compile all post ids
      context.commit(POST_ADD_MANY, data.posts) // add posts
      context.commit(TIMELINE_SET, { postIds, from, update: (timeline.postIds && !loadMore) }) // add post ids to timeline
      return postIds.length // Return the length of posts returned
    }
  },

  async [FETCH_REPLIES](context, { postId, loadMore = false }) {
    // Load reply block if exists
    let replies = context.state.replies[postId] ? context.state.replies[postId] : {}

    // Fetch new/more/updated replies
    let { ok, data } = (replies.postIds && replies.postIds.length && !loadMore) ? 
      await PostService.fetchReplyUpdates(postId, replies.postIds[0]) :
      await PostService.fetchReplies(postId,
        replies.page,
        replies.firstPostId
      )

    if (ok) {
      // Add the 'replyingTo' object to each post object
      data.replies = data.replies.map(reply => {
        reply.body.replyingTo = data.replyingTo
        return reply
      })

      let postIds = data.replies.map(post => post.id) // Compile post ids
      context.commit(POST_ADD_MANY, data.replies) // Add posts
      context.commit(REPLIES_SET, { postId, postIds }) // add post ids to reply block
      return postIds.length // Return the length of replies returned
    }
  },

  async [FETCH_POST](context, postId) {
    let { ok, data } = await PostService.fetchPost(postId) // Fetch post
    if (ok) {
      context.commit(POST_ADD, data) // Add post
      return true
    } else return false
  },

  async [CREATE_POST](context, { message, targetPostId, action }) {
    let { ok, data } = await PostService.createPost({ message, targetPostId, action }) // Create post
    if (ok) {
      context.commit(POST_ADD, data) // Add post
      context.commit(TIMELINE_SET, { from: 'public', postIds: [data.id], update: true }) // Add to timeline
      if(context.state.timelines[data.author.id]) context.commit(TIMELINE_SET, { from: data.author.id, postIds: [data.id], update: true }) // Add to user's own timeline if applicable
      return data.id // Return ID of the post
    } else return false
  },

  async [TOGGLE_POST_LIKE](context, postId) {
    let ok = await PostService.likePost(postId) // Toggle post like
    if (ok) {
      let newStatus = !context.state.posts[postId].hasLiked

      context.commit(POST_UPDATE, { 
        id: postId, 
        hasLiked: newStatus,
        stats: { ...context.state.posts[postId].stats, likes: context.state.posts[postId].stats.likes + (newStatus ? 1 : -1) }
      }) // Update post
      return true
    } else return false
  }
}

const mutations = {
  // Timeline
  [TIMELINE_SET](state, { from, postIds, update = false }) {
    // Grab timeline if exists
    let timeline = state.timelines[from]
    if (timeline) { // Timeline exists, update it
      Vue.set(state.timelines[from], 'postIds', update ? postIds.concat(timeline.postIds) : timeline.postIds.concat(postIds)) // appropriately append/prepend postIds
      Vue.set(state.timelines[from], 'page', timeline.page + 1) // increase page
    } else { // Timeline does not exist, create a new one
      Vue.set(state.timelines, from, {
        page: 1,
        postIds,
        firstPostId: postIds[0]
      })
    }
  },

  // Replies
  [REPLIES_SET](state, { postId, postIds, update = false }) {
    // Grab reply block if exists
    let replies = state.replies[postId]
    if (replies) { // Reply block exists, update it
      Vue.set(state.replies[postId], 'postIds', update ? postIds.concat(replies.postIds) : replies.postIds.concat(postIds)) // appropriately append/prepend postIds
      Vue.set(state.replies[postId], 'page', replies.page + 1) // increase page
    } else { // Reply block does not exist, create a new one
      Vue.set(state.replies, postId, {
        page: 1,
        postIds,
        firstReplyId: postIds[0]
      })
    }
  },

  // Posts
  [POST_ADD_MANY](state, posts) {
    for(let post of posts) { // Loop through each post and append to 'posts' object with key as post id
      Vue.set(state.posts, post.id, post)
    }
  },
  [POST_ADD](state, post) {
    Vue.set(state.posts, post.id, post)
  },
  [POST_UPDATE](state, updatedFields) {
    Vue.set(state.posts, updatedFields.id, {
      ...state.posts[updatedFields.id],
      ...updatedFields
    })
  },
  [POST_CLEAR](state) {
    Vue.set(state, 'posts', {})
    Vue.set(state, 'timelines', {})
    Vue.set(state, 'replies', {})
  }
}

export default {
  state, actions, mutations, getters
}