
const state = {
  router: []
}
const mutations = {

  SET_ROUTER: (state, data) => {
    state.router = data
  }

}
const actions = {
  setRouter({ commit }, data) {
    // 过滤掉其他没有子路由的配置，不是很严谨需要根据实际项目来调整
    const result = data.filter(router => {
      return 'children' in router
    })

    commit('SET_ROUTER', result)
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
