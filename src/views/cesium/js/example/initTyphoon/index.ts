/**
 * 台风轨迹实例
 * 作者:李云都
 * 时间 2021-11-14
 */
import store from '@/store'
import { getInstance, getCesium } from '../../cesiumUnit'

/**
 * 需求分析
 * 1、标会出台风的轨迹点、线、气压圈 √
 * 2、点击轨迹点展示该点位所记录的台风信息、并显示台风圈 √
 * 3、台风轨迹形成动画
 * 4、台风预测轨迹 √
 * 5、根据标点颜色可以区分当前时刻台风强度 √
 * 功能实现注意点
 * 1、forecast 为台风的预测轨迹数据,根据实时台风定位进行预测,存在轨迹点没有该数据的情况
 * 2、批量点位渲染选择用DataSource进行管理,把 DataSource 理解成一个图层,里面描绘了我们需要的各种元素
 */

const load = false
export function initTyphoon() {
  if (load) {
    setView()
    return
  }
  const typhoonData = require('./typhoonData.json')[0]
  const typhoonPoints = typhoonData.points

  drawTyphoonPoint(typhoonPoints, typhoonData) // 台风轨迹点
  drawTyphoonLine(typhoonPoints) // 台风轨迹线
  // 最后一个点位再判断是否有预测轨迹,有的话就加载
  const lastPoint = typhoonData.points[typhoonData.points.length - 1]
  if (lastPoint.forecast) {
    drawTyphoonForecastLine(lastPoint.forecast, lastPoint)
    lastPoint.forecast.forEach(element => {
      drawTyphoonPoint(element.points, typhoonData, true)
    })
  }
  setView()
}

let typhoonPointDataSource = null
/**
 * 台风轨迹点
 * @param data 轨迹点位数据
 * @param typhoonData 台风整体信息
 * @param isForecast 是否轨迹点 , 是轨迹点的话 不添加label和台风icon
 */
function drawTyphoonPoint(data, typhoonData, isForecast = false) {
  const Cesium = getCesium()
  const viewer = getInstance()
  // 创建 dataSource 往里面add点位数据
  const dataSource = new Cesium.CustomDataSource('typhoonPoint')
  viewer.dataSources.add(dataSource)
  typhoonPointDataSource = dataSource

  data.forEach((element, index) => {
    // 存储台风的编号和名称
    element.name = typhoonData.name
    element.nno = typhoonData.nno
    // 添加台风点位
    const entity: any = {
      id: `typhoonPoint${element.time}`,
      name: `台风轨迹点${element.time}`,
      entityInfo: element, // 这里存储该点位的信息,在单击时候的时候获取,进而下一步界面交互操作
      eventType: 'typhoonPointClick', // 定义一个事件标识,用于单击事件的时候处理事件分发
      onClick: (params) => { handleTyphoonPointClick(params, element) }, // 定义一个该点位的单击事件
      show: true, // 显示.
      position: Cesium.Cartesian3.fromDegrees(element.longitude, element.latitude, 10),
      point: {
        // color: Cesium.Color.BLUE, // 颜色
        // RBGA格式写法
        // eslint-disable-next-line new-cap
        color: setTtyphoonPointRankColor(element),
        pixelSize: 10, // 点大小
        scaleByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1), // 缩放大小
        translucencyByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1), // 透明度
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3000000), // 是否显示
        height: 20
      }
    }
    // 第一个轨迹点的位置显示一下台风的名称,往里面添加一个label配置
    if (index === 0 && !isForecast) {
      entity.label = {
        text: typhoonData.nno + typhoonData.name, // 文本
        show: true, // 默认显示
        font: '14px Helvetica',
        // eslint-disable-next-line new-cap
        fillColor: new Cesium.Color.fromCssColorString(
          'rgba(255, 255, 255, 1)'
        ), // 字体颜色
        backgroundColor: Cesium.Color.AQUA, // 背景颜色
        showBackground: false, // 是否显示背景颜色
        style: Cesium.LabelStyle.FILL, // label样式
        outlineWidth: 1,
        verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // 水平位置
        pixelOffset: new Cesium.Cartesian2(20, 0), // 偏移
        scaleByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1),
        translucencyByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3000000)
      }
    }

    // 如果是最后一个点添加一个台风的icon
    if (index === data.length - 1 && !isForecast) {
      const img = require('./icon-typhoon.png')
      entity.ellipse = {
        semiMinorAxis: 20000,
        semiMajorAxis: 20000,
        zIndex: 10,
        height: 20,
        entityInfo: element, // 这里存储该点位的信息,在单击时候的时候获取,进而下一步界面交互操作
        eventType: 'typhoonPointClick', // 定义一个事件标识,用于单击事件的时候处理事件分发
        onClick: (params) => { handleTyphoonPointClick(params, element) }, // 定义一个该点位的单击事件
        // rotation : Cesium.Math.toRadians(45),//旋转角
        material: new Cesium.ImageMaterialProperty({
          image: img,
          // 指定图像在每个方向上重复的次数,默认为Cesium.Cartesian2(1.0, 1.0),{Cartesian2}类型
          repeat: Cesium.Cartesian2(1.0, 1.0),
          // 默认为false，当图像具有透明性时设置为true（例如，当png具有透明部分时）
          transparent: true,
          color: Cesium.Color.WHITE.withAlpha(1) // 透明度0.5
        }),
        scaleByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1),
        translucencyByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3000000)
      }
      delete entity.point
    }
    dataSource.entities.add(entity)
  })
}
function handleTyphoonPointClick(movement, point) {
  // 画台风圈
  drawTyphoonCircle(point)
  const viewer = getInstance()
  const Cesium = getCesium()
  // 后续交互行为,比如显示该点位的台风详情信息
  store.dispatch('cesium/setData', { key: 'typhoonPointInfo', value: point })
  var ellipsoid = viewer.scene.globe.ellipsoid
  const pickingEntity = viewer.scene.pick(movement.position)
  const tooltipContainer:any = document.querySelector('.cesium-toolip-container')

  // 首先判断是否点击在球面,存在点击外太空的瞎操作
  if (viewer.camera.pickEllipsoid(movement.position, ellipsoid)) {
    const typhoonInfoPanel:any = document.querySelector('#typhoon-popup')
    typhoonInfoPanel.style.display = 'block'
    const entityClick = () => {
      /**
       * 获取该点位entity 在场景中的position,会根据地图偏移而改变
       * 所以添加postRener事件去监听,这样就做到实时刷新popup位置
       */
      const entityPosition = new Cesium.Cartesian3(pickingEntity.id._position._value.x, pickingEntity.id._position._value.y, pickingEntity.id._position._value.z)
      const scenePosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, entityPosition)
      // 样式设置
      tooltipContainer.style.top = (scenePosition.y - tooltipContainer.clientHeight / 2) + 'px'
      tooltipContainer.style.left = scenePosition.x + 'px'
    }
    // 二次点击其他点位的时候需要删除之前添加的事件
    try {
      viewer.scene.postRender.removeEventListener(entityClick)
    } catch (error) {
      console.log('删除监听事件失败了')
    }
    // 事件监听实时刷新
    viewer.scene.postRender.addEventListener(entityClick)
    // popup关闭事件
    setTimeout(() => {
      const typhoonCloseButton:any = document.querySelector('.typhoon-close-button')
      typhoonCloseButton.onclick = () => {
        typhoonInfoPanel.style.display = 'none'
        viewer.scene.postRender.removeEventListener(entityClick)
      }
    }, 0)
  }
}

// 台风轨迹线
let typhoonLineDataSource = null
function drawTyphoonLine(data) {
  const Cesium = getCesium()
  const viewer = getInstance()
  const dataSource = new Cesium.CustomDataSource('typhoonLine')
  viewer.dataSources.add(dataSource)
  typhoonLineDataSource = dataSource
  let linePoints: any = []
  /**
   * 根据台风点位强度衔接 -  线的颜色也需要不同
   */
  for (let index = 0; index < data.length; index++) {
    const element = data[index]
    linePoints.push(element.longitude)
    linePoints.push(element.latitude)
    const powerCode = getTyphoonRankCode(element)
    let nextPowerCode = ''
    if (index === data.length - 1) {
      nextPowerCode = getTyphoonRankCode(element)
    } else {
      nextPowerCode = getTyphoonRankCode(data[index + 1])
    }
    /**
     * 每到一次转折点就清空点位数据,然后往dataSource中添加一个entity
     */
    if (powerCode !== nextPowerCode || index === data.length - 1) {
      dataSource.entities.add({
        name: 'typhoonLine',
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(linePoints),
          width: 2,
          fllowSuface: true, // 是否弯曲
          material: setTtyphoonPointRankColor(element),
          clampToGround: true, // 是否贴着地面
          scaleByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1),
          translucencyByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3000000)
        }
      })
      // 清空数据
      linePoints = []
      linePoints.push(element.longitude)
      linePoints.push(element.latitude)
    }
  }
}
let typhoonForeCastLineDataSource = null
/**
 * 台风预测轨迹线
 * @param data
 * @param lastPoint
 */
function drawTyphoonForecastLine(data, lastPoint) {
  const Cesium = getCesium()
  const viewer = getInstance()
  const dataSource = new Cesium.CustomDataSource('typhoonLine')
  viewer.dataSources.add(dataSource)
  typhoonForeCastLineDataSource = dataSource
  // 颜色配置
  const colors = [
    // eslint-disable-next-line new-cap
    new Cesium.Color.fromCssColorString(
      'rgba(4, 213, 204, 1)'
    ),
    // eslint-disable-next-line new-cap
    new Cesium.Color.fromCssColorString(
      'rgba(252, 250, 3, 1)'
    ),
    // eslint-disable-next-line new-cap
    new Cesium.Color.fromCssColorString(
      'rgba(252, 250, 3, 1)'
    ),
    // eslint-disable-next-line new-cap
    new Cesium.Color.fromCssColorString(
      'rgba(252, 176, 20, 1)'
    )
  ]

  data.forEach((element, index) => {
    const linePoints: any = []
    const points = element.points
    linePoints.push(lastPoint.longitude)
    linePoints.push(lastPoint.latitude)
    points.forEach(point => {
      linePoints.push(point.longitude)
      linePoints.push(point.latitude)
    })
    dataSource.entities.add({
      name: 'typhoonForecastLine',
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(linePoints),
        width: 2,
        fllowSuface: true, // 是否弯曲
        material: new Cesium.PolylineDashMaterialProperty({
          color: colors[index]
        }),
        clampToGround: true, // 是否贴着地面
        scaleByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1),
        translucencyByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3000000)
      }
    })
  })
}
// 台风轨迹圈
let typhoonCircleDataSource = null
function drawTyphoonCircle(typhoonPointInfo) {
  const Cesium = getCesium()
  const viewer = getInstance()
  // 如果存在则先删除台风圈
  if (typhoonCircleDataSource) {
    viewer.dataSources.remove(typhoonCircleDataSource)
  }
  const dataSource = new Cesium.CustomDataSource('typhoonCircle')
  viewer.dataSources.add(dataSource)
  typhoonCircleDataSource = dataSource

  let points: any[] = []
  // 首先判断是否有形成风圈 7级 10级 12级

  // 7级风圈
  if (typhoonPointInfo.radius7 > 0) {
    points = []
    getTyphoonCirclePoints([typhoonPointInfo.longitude * 1, typhoonPointInfo.latitude * 1], typhoonPointInfo.radius7_quad.ne * 1, 0)
    getTyphoonCirclePoints([typhoonPointInfo.longitude * 1, typhoonPointInfo.latitude * 1], typhoonPointInfo.radius7_quad.se * 1, 90)
    getTyphoonCirclePoints([typhoonPointInfo.longitude * 1, typhoonPointInfo.latitude * 1], typhoonPointInfo.radius7_quad.sw * 1, 180)
    getTyphoonCirclePoints([typhoonPointInfo.longitude * 1, typhoonPointInfo.latitude * 1], typhoonPointInfo.radius7_quad.nw * 1, 270)
    if (points.length > 0) {
      dataSource.entities.add({
        name: 'typhoonCircle10',
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(points),
          material: new Cesium.Color(4 / 255, 213 / 255, 204 / 255).withAlpha(0.2),
          extrudedHeight: 0, // 距离地面高度
          outline: true,
          outlineColor: new Cesium.Color(4 / 255, 213 / 255, 204 / 255),
          outlineWidth: 10,
          scaleByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1),
          translucencyByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3000000)
        }
      })
    }
  }
  // 10级风圈
  if (typhoonPointInfo.radius10 > 0) {
    points = []
    getTyphoonCirclePoints([typhoonPointInfo.longitude * 1, typhoonPointInfo.latitude * 1], typhoonPointInfo.radius10_quad.ne * 1, 0)
    getTyphoonCirclePoints([typhoonPointInfo.longitude * 1, typhoonPointInfo.latitude * 1], typhoonPointInfo.radius10_quad.se * 1, 90)
    getTyphoonCirclePoints([typhoonPointInfo.longitude * 1, typhoonPointInfo.latitude * 1], typhoonPointInfo.radius10_quad.sw * 1, 180)
    getTyphoonCirclePoints([typhoonPointInfo.longitude * 1, typhoonPointInfo.latitude * 1], typhoonPointInfo.radius10_quad.nw * 1, 270)
    if (points.length > 0) {
      dataSource.entities.add({
        name: 'typhoonCircle10',
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(points),
          material: new Cesium.Color(252 / 255, 176 / 255, 20 / 255).withAlpha(0.2),
          extrudedHeight: 0,
          outline: true,
          outlineColor: new Cesium.Color(252 / 255, 176 / 255, 20 / 255),
          outlineWidth: 10,
          scaleByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1),
          translucencyByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3000000)
        }
      })
    }
  }
  // 12级风圈
  if (typhoonPointInfo.radius12 > 0) {
    points = []
    getTyphoonCirclePoints([typhoonPointInfo.longitude * 1, typhoonPointInfo.latitude * 1], typhoonPointInfo.radius12_quad.ne * 1, 0)
    getTyphoonCirclePoints([typhoonPointInfo.longitude * 1, typhoonPointInfo.latitude * 1], typhoonPointInfo.radius12_quad.se * 1, 90)
    getTyphoonCirclePoints([typhoonPointInfo.longitude * 1, typhoonPointInfo.latitude * 1], typhoonPointInfo.radius12_quad.sw * 1, 180)
    getTyphoonCirclePoints([typhoonPointInfo.longitude * 1, typhoonPointInfo.latitude * 1], typhoonPointInfo.radius12_quad.nw * 1, 270)
    if (points.length > 0) {
      dataSource.entities.add({
        name: 'typhoonCircle12',
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(points),
          material: new Cesium.Color(252 / 255, 250 / 255, 3 / 255).withAlpha(0.2),
          extrudedHeight: 0,
          outline: true,
          outlineColor: new Cesium.Color(252 / 250, 205 / 255, 3 / 255),
          outlineWidth: 10,
          scaleByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1),
          translucencyByDistance: new Cesium.NearFarScalar(1500, 1, 3000000, 1),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3000000)
        }
      })
    }
  }
  /**
 * 风圈的绘制
 *
 * 画台风风圈的原理如下：以圆心为原点，以正北方向为0度，顺时针画点，1度为1个点，并连成线，并最终回到正北方向，
 * 形成封闭的多边形；然后再加以填充。由于台风半径分为东北、东南、西南、西北四个方向，
 * 每个方向距离圆心可能长度不一，于是就形成了有四个锯齿状的风圈。
 * @param center
 * @param cradius
 * @param startAngle
 */
  function getTyphoonCirclePoints(center, cradius, startAngle) {
    const radius = cradius / 100
    const pointNum = 90
    const endAngle = startAngle + 90
    let sin, cos, x, y, angle
    for (let i = 0; i <= pointNum; i++) {
      angle = startAngle + (endAngle - startAngle) * i / pointNum
      sin = Math.sin(angle * Math.PI / 180)
      cos = Math.cos(angle * Math.PI / 180)
      x = center[0] + radius * sin
      y = center[1] + radius * cos
      points.push(x, y)
    }
    return points
  }
}

// 清空台风所有dataSource
export function clearTyphoonDataSource() {
  const viewer = getInstance()
  viewer.dataSources.remove(typhoonCircleDataSource)
  viewer.dataSources.remove(typhoonLineDataSource)
  viewer.dataSources.remove(typhoonPointDataSource)
  viewer.dataSources.remove(typhoonForeCastLineDataSource)
}

// 根据台风强度设置点位的颜色
export function setTtyphoonPointRankColor(point) {
  const Cesium = getCesium()

  const powerCode = getTyphoonRankCode(point)
  // 颜色说明 TY - STY - SuperTY 颜色一致
  const colorMap = {
    // eslint-disable-next-line new-cap
    'TD': new Cesium.Color.fromCssColorString(
      'rgba(4, 213, 204, 1)'
    ),
    // eslint-disable-next-line new-cap
    'TS': new Cesium.Color.fromCssColorString(
      'rgba(252, 250, 3, 1)'
    ),
    // eslint-disable-next-line new-cap
    'STS': new Cesium.Color.fromCssColorString(
      'rgba(252, 176, 20, 1)'
    ),
    // eslint-disable-next-line new-cap
    'TY': new Cesium.Color.fromCssColorString(
      'rgba(252, 250, 3, 1)'
    ),
    // eslint-disable-next-line new-cap
    'STY': new Cesium.Color.fromCssColorString(
      'rgba(252, 250, 3, 1)'
    ),
    // eslint-disable-next-line new-cap
    'SuperTY': new Cesium.Color.fromCssColorString(
      'rgba(252, 250, 3, 1)'
    )

  }

  return colorMap[powerCode]
}

// 获取台风强度等级编码
export function getTyphoonRankCode(point) {
  const power = point.power
  let code = ''
  if (power <= 7) {
    code = 'TD' // 热带低压
  } else if (power <= 9) {
    code = 'TS' // 热带风暴
  } else if (power <= 11) {
    code = 'STS' // 强热带风暴
  } else if (power <= 13) {
    code = 'TY' // 台风
  } else if (power <= 15) {
    code = 'STY' // 强台风
  } else {
    code = 'SuperTY' // 超强台风
  }
  return code
}

function setView() {
  const viewer = getInstance()
  const Cesium = getCesium()

  // 设置相机视角
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(112.40877399495588, 19.3527135036516, 1559486),
    orientation: {
      heading: Cesium.Math.toRadians(0.0), // 相机方向
      pitch: Cesium.Math.toRadians(-90) // 倾斜角度
    }
  })
}
