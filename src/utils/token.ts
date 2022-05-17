import cookie from 'js-cookie'
cookie.setItem = cookie.set
cookie.getItem = cookie.get
cookie.removeItem = cookie.remove

const defaultKeys = {
  token: {
    type: 'cookie',
    key: 'token'
  },
  userInfo: {
    type: 'localStorage',
    key: 'userInfo'
  }
}
const { token, userInfo } = defaultKeys

const storageType = { cookie, localStorage, sessionStorage }

function getStorageObject({ type }) {
  if (!type) type = 'sessionStorage'
  return storageType[type]
}

function getExpires({ expires }:any) {
  if (typeof expires === 'number') return { expires }
  return null
}

export function getToken() {
  return getStorageObject(token).getItem(token.key)
}

export function setToken(_token) {
  return getStorageObject(token).setItem(token.key, _token, getExpires(token))
}

export function removeToken() {
  return getStorageObject(token).removeItem(token.key)
}

export function getUserInfo() {
  const _userInfo = getStorageObject(userInfo).getItem(userInfo.key)
  if (_userInfo) {
    return JSON.parse(_userInfo)
  }
  return ''
}

export function setUserInfo(_userInfo) {
  return getStorageObject(userInfo).setItem(userInfo.key, JSON.stringify(_userInfo), getExpires(userInfo))
}

export function removeUserInfo() {
  return getStorageObject(userInfo).removeItem(userInfo.key)
}

