/**
 * 路径规划
 * 作者:李云都
 * 时间:2021-11-25
 */
import store from '@/store'
import { cesiumUnits, getCesium, getInstance } from '../../js/cesiumUnit'
import startIcon from './start.png'
import endIcon from './end.png'
/**
 * 地图点击事件
 * 给起点/终点赋值
 */
export function mapClick(movement) {
  const status = store.getters.routePlanning.status

  if (status) {
    const viewer = getInstance()
    const Cesium = getCesium()
    const units = cesiumUnits()
    const lnglat = units.turnLnglat(movement.position)
    // 保存点击后的经纬度数据
    store.dispatch('cesium/setRoutePlanning', { key: store.getters.routePlanning.status, value: `${lnglat.lng.toFixed(8)},${lnglat.lat.toFixed(8)}` })
    // 往地图中添加 起点/终点 图标,添加前需要删除之前存在的图标

    try {
      units.removeEntitiesById(`routePlanning${status}`)
    } catch (error) {
      console.log(`路径规划 - 删除图标失败`)
    }
    viewer.entities.add({
      id: `routePlanning${status}`,
      name: `routePlanning${status}`,
      position: Cesium.Cartesian3.fromDegrees(lnglat.lng, lnglat.lat),
      billboard: {
        image: status === 'startPoint' ? startIcon : endIcon,
        name: `routePlanning${status}`,
        width: 32,
        height: 32,
        scaleByDistance: new Cesium.NearFarScalar(1500, 1, 90000, 1),
        translucencyByDistance: new Cesium.NearFarScalar(1500, 1, 90000, 1),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 90000)
      }

    })

    // 清除选中状态
    store.dispatch('cesium/setRoutePlanning', { key: 'status', value: '' })
  }
}
