/**
 * @desc Constants for every type of action
 */

// Authentication
export const LOGIN = "login";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const CHECK_AUTH = "checkAuth";
export const CHECK_EMAIL_VERIFICATION = "checkEmailVerification"
export const REQUEST_EMAIL_VERIFICATION = "requestEmailVerification"
export const REQUEST_RECOVER_PASSWORD = "requestRecoverPassword"
export const RESET_PASSWORD = "resetPassword"

// Timeline & Posts
export const FETCH_TIMELINE = "fetchTimeline"
export const TOGGLE_POST_LIKE = "togglePostLike"
export const FETCH_REPLIES = "fetchReplies"
export const FETCH_REPLY_UPDATES = "fetchReplyUpdates"
export const FETCH_POST = "fetchPost"
export const CREATE_POST = "createPost"

// Users
export const TOGGLE_USER_FOLLOW = "toggleUserFollow"
export const FETCH_USER = "fetchUser"
export const SEARCH_USER = "searchUser"
export const EDIT_DISPLAY_INFO = "editDisplayInfo"