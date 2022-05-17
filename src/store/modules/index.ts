const state = {
  data: ''
}
const mutations = {
  SET_DATA: (state, data) => {
    state.data = data
  }
}
const actions = {
  addDat({ commit }, data) {
    return new Promise<void>((resolve, reject) => {
      commit('SET_DATA', data)
      resolve()
    })
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
