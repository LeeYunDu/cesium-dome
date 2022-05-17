
export function getToken() {
  if (sessionStorage.getItem('accessToken')) {
    try {
      return JSON.parse((sessionStorage.getItem('accessToken')) as string)
    } catch (error) {
      // 如果数据被破坏
      sessionStorage.removeItem('accessToken')
      return ''
    }
  } else {
    return ''
  }
}

export function setToken(token) {
  return sessionStorage.setItem('accessToken', JSON.stringify(token))
}

export function removeToken() {
  return sessionStorage.removeItem('accessToken')
}

