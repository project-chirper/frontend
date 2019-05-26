import PostService from '../services/post.service'

import Cache from '@mattl019/objectset'

import {
	FETCH_TIMELINE,
	FETCH_TIMELINE_UPDATES, 
	TOGGLE_POST_LIKE, 
  FETCH_REPLIES,
  FETCH_REPLY_UPDATES,
  FETCH_POST,
  CREATE_POST
} from './actions.type'

import {
  REPLIES_SET, TIMELINE_SET, POST_CACHE_ADD
} from './mutations.type'

const state = {
  timelines: new Cache("from"), // { from: 'public' | 'username', posts: [],  page: 0, firstPostId: undefined }
  replies: new Cache("postId"), // { postId (ukey), posts, firstReplyId, page }
  posts: new Cache("id") // { id (ukey), body, author, ... } regular post cache
}

const getters = {

}

const actions = {
  /**
   * @desc Fetches the timeline, with the current page.
   * @returns Whole timeline, or false
   */
  async [FETCH_TIMELINE](context, { loadMore = false, author = 'public' }) {
    // Check cache for timeline
    let timeline = context.state.timelines.fetch(author)
    if (timeline && !loadMore) return timeline.posts

    let { ok, data } = await PostService.fetchTimeline(
      timeline.page, // current page
      timeline.firstPostId, // first post id fetched,
      author
    )

		if (ok) {
      if (author !== 'public') data.posts = data.posts.map(post => {
        post.author = data.author
        return post
      })

      let posts = timeline ? timeline.posts.concat(data.posts) : data.posts
      context.commit(TIMELINE_SET, { posts, author }) // append to cache
      return posts
    } else return false
  },
  /**
   * @desc Fetches timeline updates
   * @returns Whole timeline with updates
   */
  async [FETCH_TIMELINE_UPDATES](context, author = 'public') {
    let timeline = context.state.timelines.fetch(author)
    if (!timeline || (timeline && timeline.posts.length === 0)) return await context.dispatch(FETCH_TIMELINE, { author }) // If there are zero posts, simply try to fetch a new timeline

    let { ok, data } = await PostService.fetchTimelineUpdates(timeline.posts[0].id, author)
    if (ok) {
      if (author !== 'public') data.posts = data.posts.map(post => {
        post.author = data.author
        return post
      })

      let posts = data.posts.concat(timeline.posts)
      context.commit(TIMELINE_SET, { posts, author }) // add to cache
      return posts
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
      data.replies = data.replies.map(reply => {
        reply.body.replyingTo = data.replyingTo
        return reply
      })
      let posts = replies ? replies.posts.concat(data.replies) : data.replies
      context.commit(REPLIES_SET, { postId, posts })
      return posts
    } else return false
  },

  /**
   * @desc Fetches reply updates for a post (new replies)
   * @param postId the post id to search reply updates for
   * @returns Number of updated replies fetched, or false if error
   */
  async [FETCH_REPLY_UPDATES](context, postId) {
    let replies = context.state.replies.fetch(postId) // fetch reply block
    if (!replies || !replies.posts[0]) return await context.dispatch(FETCH_REPLIES, { postId }) // There are no replyblock or zero replies, try to fetch them

    let { ok, data } = await PostService.fetchReplyUpdates(postId, replies.posts[0].id)
    if (ok) {
      data.replies = data.replies.map(reply => {
        reply.body.replyingTo = data.replyingTo
        return reply
      })

      let posts = data.replies.concat(replies.posts)
      context.commit(REPLIES_SET, { postId, posts })
      return posts
    } else return false
  },
  
	async [FETCH_POST](context, postId) {
    let post = context.state.posts.fetch(postId)
    if (post) return post // If post is in posts cache, simply return it

    let { ok, data } = await PostService.fetchPost(postId)
		if (ok) {
      context.commit(POST_CACHE_ADD, data)
      return data
    }
		else return false
  },

  /**
   * @desc Creates a post
   */
  async [CREATE_POST](context, { message, targetPostId, action }) {
    let { ok, data } = await PostService.createPost({ message, targetPostId, action })
    if (ok) {
      context.commit(POST_CACHE_ADD, data) // Add new post to post cache
      return data
    }
  }
}

const mutations = {
  [TIMELINE_SET](state, { posts, author }) {
    let timeline = state.timelines.fetch(author)
    if (timeline) {
      state.timelines.update(author, {
        ...timeline,
        posts,
        page: timeline.page + 1,
      })
    } else {
      state.timelines.add({
        from: author,
        page: 1,
        posts,
        firstReplyId: posts[0] ? posts[0].id : undefined
      })
    }
  },
  [REPLIES_SET](state, { postId, posts }) {
    let replies = state.replies.fetch(postId) // current reply block
    if (replies) { // reply block exists
      state.replies.update(postId, {
        ...replies,
        posts,
        page: replies.page + 1,
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
  [POST_CACHE_ADD](state, post) {
    state.posts.add(post)
  }
}

export default {
  state, actions, mutations, getters
}