// import Cookies from 'js-cookie'

// 设置cookie
export function setCookie(c_name, value, expiremMinutes) {
  var exdate = new Date()
  exdate.setTime(exdate.getTime() + expiremMinutes * 60 * 1000)
  document.cookie = c_name + '=' + escape(value) + ((expiremMinutes == null) ? '' : ';expires=' + exdate.toGMTString())
  // const otherAttribute = {
  //   expires: ((expiremMinutes == null) ? '' : ';expires=' + exdate.toGMTString()),
  //   SameSite: 'None',
  //   Secure: 'Secure'
  // }
  // Cookies.set(c_name, value, otherAttribute)
}

// 读取cookie
export function getCookie(c_name) {
  if (document.cookie.length > 0) {
    var c_start = document.cookie.indexOf(c_name + '=')
    // eslint-disable-next-line
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1
      var c_end = document.cookie.indexOf(';', c_start)
      // eslint-disable-next-line
      if (c_end == -1) { c_end = document.cookie.length }
      return unescape(document.cookie.substring(c_start, c_end))
    }
  }
  return ''
}

// 删除cookie
export function delCookie(c_name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(c_name)
  if (cval != null) {
    document.cookie = c_name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

export const cleanArray = function(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export const toQueryString = function(obj) {
  if (!obj) return ''
  const list = cleanArray(
    Object.keys(obj).map(key => {
      if (obj[key] === undefined) return ''
      if (key === 'WebAPIBean') {
        obj[key] = JSON.stringify(obj[key])
      }

      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
    })
  ).join('&')
  return list
}
