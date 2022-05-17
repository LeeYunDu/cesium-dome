
/**
 * 说明: cesium 地图方法集合
 * 创建者: 李云都
 * 日期: 2021-07-12
 * 工具包含以下:
 * turnLnglat => Cartesian2 坐标 转换 为经纬度
 * turnCartesian3 => 经纬度 + 高度 转换为 Cartesian3坐标系
 * computeParabolaPoint => 根据 2个经纬度的点 返回一个抛物线的点位集合
 * generateCurve => 根据 Cartesian3的两个点位 返回一个抛物线的点位集合
 * removeAll => 删除所有entity
 * removeEntities => 删除其中一个entity
 * removeEntitiesById => 根据entity的ID进行删除
 * hmtlToImg => DOM节点转为base64位图片
 * getDistance => 根据2个经纬度点计算之间的距离
 */
import store from '@/store'

import html2canvas from 'html2canvas'

export function getInstance() {
  return store.getters.viewer
}
export function getCesium() {
  return store.getters.Cesium
}

/**
 * 工具类
 */

export function cesiumUnits() {
  const viewer = getInstance()
  const Cesium = getCesium()
  /**
   * Cartesian2 坐标 转换 为经纬度
   * @position 为 Cartesian2 坐标
   */
  const turnLnglat = (position) => {
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

  /**
   * 经纬度 + 高度 转换为 Cartesian3坐标系
   * @param point
   * @returns
   */
  const turnCartesian3 = (point) => {
    const result = Cesium.Cartesian3.fromDegrees(
      point.lng, point.lat, point.z
    )
    return result
  }

  /**
   * 根据 2个经纬度的点 返回一个抛物线的点位集合
   * @param startPoint
   * @param endPoint
   * @param midHeight
   * @param pointCount
   * @returns
   */
  const computeParabolaPoint = (startPoint, endPoint, midHeight = 100, pointCount = 50) => {
    // 设置抛物线的顶点的高度

    const h = midHeight
    const L =
        Math.abs(startPoint.lng - endPoint.lng) >
          Math.abs(startPoint.lat - endPoint.lat)
          ? Math.abs(startPoint.lng - endPoint.lng)
          : Math.abs(startPoint.lat - endPoint.lat)

    const num = pointCount
    const result:Array<Array<number>> = []

    let dlt = L / num
    if (
      Math.abs(startPoint.lng - endPoint.lng) >
        Math.abs(startPoint.lat - endPoint.lat)
    ) {
      // 以lng为基准
      const delLat = (endPoint.lat - startPoint.lat) / num
      if (startPoint.lng - endPoint.lng > 0) {
        dlt = -dlt
      }
      for (let i = 0; i < num; i++) {
        const tempH =
            h -
            (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * h) /
            Math.pow(L, 2)
        const lng = startPoint.lng + dlt * i
        const lat = startPoint.lat + delLat * i
        switch (i) {
          case 0:
            result.push([startPoint.lng, startPoint.lat, 0])
            break
          case num - 1:
            result.push([endPoint.lng, endPoint.lat, 0])
            break
          default:
            result.push([lng, lat, tempH])
        }
      }
    } else {
      // 以lat为基准
      const dellng = (endPoint.lng - startPoint.lng) / num
      if (startPoint.lat - endPoint.lat > 0) {
        dlt = -dlt
      }
      for (let i = 0; i < num; i++) {
        const tempH =
            h -
            (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * h) /
            Math.pow(L, 2)
        const lng = startPoint.lng + dellng * i
        const lat = startPoint.lat + dlt * i
        switch (i) {
          case 0:
            result.push([startPoint.lng, startPoint.lat, 0])
            break
          case num:
            result.push([endPoint.lng, endPoint.lat, 0])
            break
          default:
            result.push([lng, lat, tempH])
        }
      }
    }
    // 返回的结果 [经度,维度,高度,经度,维度,高度]
    return Cesium.Cartesian3.fromDegreesArrayHeights(result.flat())
  }

  /**
   * 根据 Cartesian3的两个点位 返回一个抛物线的点位集合
   * @param startPoint
   * @param endPoint
   * @returns
   */
  const generateCurve = (startPoint, endPoint) => {
    const addPointCartesian = new Cesium.Cartesian3()
    Cesium.Cartesian3.add(startPoint, endPoint, addPointCartesian)
    const midPointCartesian = new Cesium.Cartesian3()
    Cesium.Cartesian3.divideByScalar(addPointCartesian, 2, midPointCartesian)
    const midPointCartographic = Cesium.Cartographic.fromCartesian(
      midPointCartesian
    )
    // 设置抛物线的顶点  计算 2个三维坐标点之间的距离
    const height = Cesium.Cartesian3.distance(startPoint, endPoint)
    midPointCartographic.height = height > 100 ? 100 : height
    const midPoint = new Cesium.Cartesian3()
    Cesium.Ellipsoid.WGS84.cartographicToCartesian(
      midPointCartographic,
      midPoint
    )
    const spline = new Cesium.CatmullRomSpline({
      times: [0.0, 0.5, 1.0],
      points: [startPoint, midPoint, endPoint]
    })
    const curvePoints:Array<any> = []
    for (let i = 0, len = 200; i < len; i++) {
      curvePoints.push(spline.evaluate(i / len))
    }
    return curvePoints
  }

  /**
   * 抛物线绘制
   * @param twoPoints [108.89574878031878, 20.23612176742662, 120.32036514618619, 29.026845281833523]
   * @returns
   */
  const parabola = (twoPoints) => {
    const Cesium = getCesium()
    let s = []
    const startPoint:any = [twoPoints[0], twoPoints[1], 0] // 起点的经度、纬度
    s = s.concat(startPoint)
    const step = 80 // 线的多少，越多则越平滑(但过多浏览器缓存也会占用越多)
    const heightProportion = 0.125 // 最高点和总距离的比值
    const dLon = (twoPoints[2] - startPoint[0]) / step // 经度差值
    const dLat = (twoPoints[3] - startPoint[1]) / step // 纬度差值
    const deltaLon = dLon * Math.abs(111000 * Math.cos(twoPoints[1])) // 经度差(米级)
    const deltaLat = dLat * 111000 // 纬度差(米),1纬度相差约111000米
    const endPoint:any = [0, 0, 0] // 定义一个端点（后面将进行startPoint和endPoint两点画线）
    const heigh = ((step * Math.sqrt(deltaLon * deltaLon + deltaLat * deltaLat) * heightProportion) as any).toFixed(0) * 2
    const x2 = (10000 * Math.sqrt(dLon * dLon + dLat * dLat)) // 小数点扩大10000倍，提高精确度
    const a = (heigh / (x2 * x2))
    function y(x, height) { return height - a * x * x }
    for (var i = 1; i <= step; i++) { // 逐“帧”画线
      endPoint[0] = startPoint[0] + dLon // 更新end点经度
      endPoint[1] = startPoint[1] + dLat // 更新end点纬度
      const x = x2 * (2 * i / step - 1) // 求抛物线函数x
      endPoint[2] = ((y(x, heigh)) as any).toFixed(0) * 1 // 求end点高度
      s = s.concat(endPoint)

      // end点变为start点
      startPoint[0] = endPoint[0]
      startPoint[1] = endPoint[1]
      startPoint[2] = endPoint[2]
    }
    return Cesium.Cartesian3.fromDegreesArrayHeights(s)
  }

  /**
   * 删除所有实体
   */
  const removeAll = () => {
    viewer.entities.removeAll()
  }

  /**
   * 删除其中一个实体
   * @param entities 实体
   */
  const removeEntities = (entities) => {
    viewer.entities.remove(entities)
  }

  /**
   * 根据实体ID删除实体
   * @param id 实体的ID
   */
  const removeEntitiesById = (id) => {
    const entities = viewer.entities.getById(id)
    viewer.entities.remove(entities)
  }

  /**
   * DOM节点转换为base64位图片
   * @param dom
   * @returns
   */
  const hmtlToImg = (dom) => {
    return new Promise((resolve, reject) => {
      // { backgroundColor: null }
      html2canvas(dom as HTMLElement, { useCORS: true, width: dom.offsetWidth, height: dom.offsetHeight, backgroundColor: null }).then(canvas => {
        const dataURL:string = canvas.toDataURL('image/png')
        resolve(dataURL)
      })
    })
  }

  /**
   * 根据2个经纬度点计算之间的距离
   * @param startPoint
   * @param endPoint
   * @returns
   */

  const getDistance = (startPoint, endPoint) => {
    var satrt = Cesium.Cartographic.fromDegrees(startPoint.longitude, startPoint.latitude)
    var end = Cesium.Cartographic.fromDegrees(endPoint.longitude, endPoint.latitude)
    var geodesic = new Cesium.EllipsoidGeodesic()
    geodesic.setEndPoints(satrt, end)
    var distance = geodesic.surfaceDistance
    return distance
  }

  return {
    turnLnglat, turnCartesian3,
    removeAll, removeEntities, removeEntitiesById,
    generateCurve, computeParabolaPoint, hmtlToImg, getDistance, parabola
  }
}

/**
 * 地图事件中转分发,根据定义的eventType做判断,各种处理自己的交互逻辑
 * 跨组件交互方法
 * 1、组件内监听store中选中的entity,根据类型做判断
 * @param pickingEntity 选中的entity
 */
export function mapEventTransit(movement) {
  const viewer = getInstance()
  const pickingEntity = viewer.scene.pick(movement.position)

  try {
    const entityInstance = pickingEntity.id
    const eventType = entityInstance.eventType || null

    // 如果存在单击事件 则可以直接掉用,也可以通过entity的类型做判断额外添加一些参数给事件
    if ('onClick' in entityInstance) {
      switch (eventType) {
        // 台风轨迹点单击事件
        case 'typhoonPointClick':
          entityInstance.onClick(movement)

          break

        default:
          break
      }
    }
  } catch (error) {
    console.log('单击事件转发出现错误', pickingEntity)
  }
}
