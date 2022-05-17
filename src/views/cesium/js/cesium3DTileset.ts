/**
 * Cesium 加载 白膜案例,可设置白膜颜色
 * 作者:李云都
 * 时间:2021-11-22
 */
import store from '@/store'

import { getInstance, getCesium } from './cesiumUnit'

let load = false
// 加载地区白膜数据
export const initAreaModel3DTileset = (url, options:any = { addPrimitives: true }) => {
  const viewer = getInstance()
  const Cesium = getCesium()

  // 示例 - 防止一直加载
  if (load) {
    // 设置相机视角
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(120.64673072813616, 27.922724651993942, 2500), //  温州鹿城区
      orientation: {
        heading: Cesium.Math.toRadians(0.78), // 相机方向
        pitch: Cesium.Math.toRadians(-10) // 倾斜角度
      }
    })
    return
  }

  var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    // url: 'http://localhost:9000/model/a19ee7603e0f11eca1072321395079df/tileset.json',
    // url: 'http://localhost:9000/model/1fad73004bfe11ec96180be6e14bc6f7/tileset.json',
    url: 'http://192.168.2.25:8825/wenzhouData/tileset.json',
    modelMatrix: Cesium.Matrix4.fromArray([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  }))

  /**
   * 设置3DTiles样式
   * 给白膜添加颜色
   * 根据建筑数据中的Floor字段来判断颜色
   */
  tileset.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ['${Floor} >= 8', 'rgba(219, 232, 145,1)'],

        ['${Floor} >= 4', 'rgb(252, 230, 200)'],

        ['true', 'rgb(153, 179, 225)']]
    }
  })

  // 是否当这个模型加载完毕后添加至primitives
  if (options.addPrimitives) {
    tileset.readyPromise.then(tileset => {
      viewer.scene.primitives.add(tileset)
      // 设置相机视角
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120.64673072813616, 27.922724651993942, 2500), //  温州鹿城区
        orientation: {
          heading: Cesium.Math.toRadians(0.78), // 相机方向
          pitch: Cesium.Math.toRadians(-10) // 倾斜角度
        }
      })
    }).otherwise(function(error) {
      console.log(error)
    })
  }
  load = true
}

// 白膜高亮显示
var previousPickedEntity = {
  feature: undefined,
  originalColor: undefined
} as any

export const tilesetHighlightEvent = (pickingEntity) => {
  const viewer = getInstance()
  const Cesium = getCesium()

  /**
   * Cesium3DTileFeature 3D高亮显示
   */

  // 判断选择是否为Cesium3DTileFeature
  if (pickingEntity instanceof Cesium.Cesium3DTileFeature) {
    if (previousPickedEntity.feature !== undefined) {
      // 还原前选择要素的本颜色
      previousPickedEntity.feature.color = previousPickedEntity.originalColor
      // 将当前选择要素及其颜色添加到 previousPickedEntity
      previousPickedEntity.feature = pickingEntity
      previousPickedEntity.originalColor = pickingEntity.color
    }
    // 将当前选择要素及其颜色添加到 previousPickedEntity
    previousPickedEntity.feature = pickingEntity
    previousPickedEntity.originalColor = pickingEntity.color
  }

  // 将模型变为黄色高亮
  setTimeout(() => {
    pickingEntity.color = Cesium.Color.YELLOW
  }, 0)
}
