const state = {
  viewer: null,
  Cesium: null,
  // 台风轨迹点信息
  typhoonPointInfo: {},
  // 窗体信息
  windowInfo: {},

  // 路径规划
  routePlanning: {
    startPoint: '',
    endPoint: '',
    status: ''
  }

}
const mutations = {
  SET_DATA: (state, data) => {
    state[data.key] = data.value
  },
  SET_INSTANCE: (state, data) => {
    state.viewer = data
  },
  SET_CESIUM: (state, data) => {
    state.Cesium = data
  },
  SET_MENUMARKER: (state, data) => {
    state.menuMarker[data.type] = data.data
  },
  SET_ROUTEPLANNING: (state, data) => {
    state.routePlanning[data.key] = data.value
  }
}
const actions = {
  setInstance({ commit }, data) {
    commit('SET_INSTANCE', data)
  },
  setCesium({ commit }, data) {
    commit('SET_CESIUM', data)
  },
  setMarker({ commit }, data) {
    commit('SET_MENUMARKER', data)
  },
  setData({ commit }, data) {
    commit('SET_DATA', data)
  },
  setRoutePlanning({ commit }, data) {
    commit('SET_ROUTEPLANNING', data)
  }

}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
