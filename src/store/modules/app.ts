import { getRouteAuthCodes } from '@/api/user'
import { initRouter } from '@/router/index'
import { constantRouterMap } from '@/router/index'
const state = {
  loginMethods: [
    { title: '账号名称', type: 'username' },
    // { title: '短信登陆', type: 'sms' },
    // { title: '钉钉扫码', type: 'dd-qrcode', redirect: 'http://10.37.253.19:9001/godata/portal/QRLoginFrame.html' },
    { title: '浙政钉扫码', type: 'zzd-qrcode', redirect: 'http://10.37.253.19:8080/godata/portal/QRLoginFrame.html', appCode: 'godata' }
  ],
  router: [],
  allowVisitRoute: [],
  freeLogin: false // 是否单点登录

}
const mutations = {
  SET_DATA: (state, data) => {
    state[data.key] = data.value
  },
  SET_ROUTER: (state, data) => {
    state.router = data
  }

}
const actions = {
  setData({ commit }, data) {
    return new Promise<void>((resolve, reject) => {
      commit('SET_DATA', data)
      resolve()
    })
  },
  // 接口请求获取后端模块配置路由
  generateRoutes({ commit, rootState, dispatch }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async(resolve, reject) => {
      const response = await getRouteAuthCodes()
        .catch(e => {
          reject(e)
        })

      if (response.code === 0) {
        // 添加异步路由到router
        await initRouter(response.data)
        resolve(true)
      }
    })
  },
  setRouter({ commit }, data) {
    commit('SET_ROUTER', data)
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
