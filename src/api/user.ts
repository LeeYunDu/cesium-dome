const defaultSettings = require('@/settings')

import request from '@/utils/request'
const scope = 'server'

export function login(username, password, code, randomStr) {
  const grant_type = 'password'

  return request({
    url: '/auth/oauth/token',
    headers: {
      isToken: false,
      'Authorization': 'Basic cGlnOnBpZw=='
    },
    method: 'post',
    params: { username, password, randomStr, code, grant_type, scope }
  })
}

// 获取当前登录用户信息
export function getInfo() {
  return request.get('/admin/user/info')
}

export function logout() {
  return request({
    url: '/auth/token/logout',
    method: 'delete'
  })
}

export function ddQRCodeLogin(data) {
  return request.post('/dingding/qrcodelogin2', data) // 钉钉扫码接口改成2
}

export function getMobileCode(data) {
  return request.post('/userAccount/sendLoginSms', data)
}

export function getDDAppId(data) {
  return request.post('/dingding/getDingdingParams', data)
}

export function getZZDAppId() {
  return request.get('/admin/DingTalk/getZZDAppId')
}

export function zzdQRCodeLogin(data) {
  return request.post('/govding/qrcodelogin', data)
}

export function activateZZDAccount(data) {
  return request.post('/govding/activateAccount', data)
}

// 获取账号可访问的路由权限地址
export function getRouteAuthCodes() {
  return request({
    url: '/admin/menu',
    params: { parentId: defaultSettings.applicationID },
    method: 'get'
  })
}
