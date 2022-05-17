
const getters = {
  // 框架配置
  testData: state => state.index.data,
  userInfo: state => state.user.userInfo,
  permissions: state => state.user.permissions,
  router: state => state.app.router,
  allowVisitRoute: state => state.app.allowVisitRoute,
  freeLogin: state => state.app.freeLogin,
  // Cesium 配置
  viewer: state => state.cesium.viewer,
  Cesium: state => state.cesium.Cesium,
  typhoonPointInfo: state => state.cesium.typhoonPointInfo,
  windowInfo: state => state.cesium.windowInfo,
  routePlanning: state => state.cesium.routePlanning
}

export default getters
