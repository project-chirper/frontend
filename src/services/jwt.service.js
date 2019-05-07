const ID_TOKEN_KEY = 'id_token' // var name in localStorage

export const getToken = () => window.localStorage.getItem(ID_TOKEN_KEY) // Get token
export const saveToken = token => window.localStorage.setItem(ID_TOKEN_KEY, token) // Set token
export const destroyToken = () => window.localStorage.removeItem(ID_TOKEN_KEY) // Destroy token

export default { getToken, saveToken, destroyToken }