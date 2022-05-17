/**
 * 显示窗体信息,为了方便看到鼠标所指向的经纬度、高度、方向等信息
 * 作者：李云都
 * 时间：2021-11-20
 */
import store from '@/store'
import { getCesium, getInstance } from '../../cesiumUnit'

export function mouseOverHandler(movement) {
  const viewer = getInstance()
  const { lng, lat, height } = turnLnglat(movement.endPosition)

  // 俯仰角
  var pitch = Number(viewer.scene.camera.pitch).toFixed(2)
  // 方向
  var heading = Number(viewer.scene.camera.heading).toFixed(2)
  const info = {
    lng, lat, height, heading, pitch
  }
  store.dispatch('cesium/setData', { key: 'windowInfo', value: info })
}

const turnLnglat = (position) => {
  const Cesium = getCesium()
  const viewer = getInstance()
  const ellipsoid = viewer.scene.globe.ellipsoid
  const cartesian = viewer.camera.pickEllipsoid(position, ellipsoid)
  let lng, lat, height
  if (cartesian) {
    // 将笛卡尔坐标转换为地理坐标
    var cartographic = ellipsoid.cartesianToCartographic(cartesian)
    // 将弧度转为度的十进制度表示
    lng = Cesium.Math.toDegrees(cartographic.longitude)
    lat = Cesium.Math.toDegrees(cartographic.latitude)
    // 获取相机高度
    height = Math.ceil(viewer.camera.positionCartographic.height)
  }
  return {
    lng, lat, height
  }
}
