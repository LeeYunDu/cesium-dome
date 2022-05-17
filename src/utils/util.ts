/* eslint-disable no-undef */
// import { EventListenerOrEventListenerObject } from 'vue'
import * as CryptoJS from 'crypto-js'
export const loadStyle = (url:string) => {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(link)
}

// eslint-disable-next-line no-undef
export const on = (element:HTMLElement|Document|Window, event:string, handler:EventListenerOrEventListenerObject, useCapture = false) => {
  if (element && event && handler) {
    element.addEventListener(event, handler, useCapture)
  }
}

export const off = (element:HTMLElement|Document|Window, event:string, handler:EventListenerOrEventListenerObject, useCapture = false) => {
  if (element && event && handler) {
    element.removeEventListener(event, handler, useCapture)
  }
}

export const getImage = (icon) => {
  try {
    return require(`@/assets/${icon}`)
  } catch (error) {
    return ''
  }
}

/**
 *加密处理
 */
export const encryption = (params) => {
  const {
    data,
    type,
    param
  } = params
  let key = params.key
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele])
    })
  } else {
    param.forEach(ele => {
      var data = result[ele]
      key = CryptoJS.enc.Latin1.parse(key)
      var iv = key
      // 加密
      var encrypted = CryptoJS.AES.encrypt(
        data,
        key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.ZeroPadding
        })
      result[ele] = encrypted.toString()
    })
  }
  return result
}

export function getUrlQuery(url, key) {
  var reg = new RegExp(`(^|&|/?)${key}=([^&]*)(&|$)`)
  var matchs = url.match(reg)
  if (matchs !== null) return unescape(matchs[2])
  return null
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 多层级的对象合并
export function assiginObj(target = {}, sources = {}) {
  const obj = target
  if (typeof target !== 'object' || typeof sources !== 'object') {
    return sources // 如果其中一个不是对象 就返回sources
  }
  for (const key in sources) {
    // 如果target也存在 那就再次合并
    if (target.hasOwnProperty(key)) {
      obj[key] = assiginObj(target[key], sources[key])
    } else {
      // 不存在就直接添加
      obj[key] = sources[key]
    }
  }
  return obj
}

export function deleteUrlQuery(url, deleteKey) {
  const start = url.indexOf(deleteKey)
  if (start !== -1) {
    const deleteKeyEndIndex = start + deleteKey.length
    let end = url.indexOf('&', deleteKeyEndIndex)
    end = end === -1 ? url.length : end + 1
    return url.slice(0, start) + url.slice(end)
  } else {
    return url
  }
}

