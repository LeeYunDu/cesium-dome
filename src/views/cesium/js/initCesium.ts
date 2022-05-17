/**
 * 初始化Cesium
 * 作者:李云都
 * 时间:2021-11-22
 */
import { injectCesium } from './importCesium.js'
import store from '@/store'
import { initTdtImageLayout, initWorldImagery, initDongPingS3MLayout, initArcgisLayout, initMapBoxLayout } from './initLayout'
import { cesiumUnits, mapEventTransit } from './cesiumUnit'
import { createPolyLineMaterial } from './example/dynamicMaterial/index'
import { mouseOverHandler } from './example/windowInfo/index'
import { dynamicTrack } from './example/dynamicTrack'
import { mapClick } from '../components/routePlanning/index'
import { initAggregationPoint } from './example/aggregationPoint/index'

export function initCesium() {
  let Cesium: unknown
  // 异步加载cesium
  injectCesium().then(windowCesium => {
    Cesium = windowCesium

    // 注入天地图 影像底图 插件脚本
    // const script = document.createElement('script')
    // script.src = `http://api.tianditu.gov.cn/cdn/plugins/cesium/cesiumTdt.js`
    // document.body.appendChild(script)

    store.dispatch('cesium/setCesium', Cesium).then(() => {
      // 插件加载完毕后 地图初始化
      try {
        initMap(Cesium)
      } catch (error) {
        console.log(error)
        // initCesium()
      }
    })
  })
}

async function initMap(Cesium) {
  // 注册 cesium.Ion 后会有个token凭证,可以用于调用官网的地图主题
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMmVmNWM3YS1hODU0LTRiYjQtYjE2Mi0zZDgyNTQ5YTBiZmQiLCJpZCI6NTk0MDksImlhdCI6MTYyNDEwMDY1M30.hTkbJKW0VIpBY2aOmQvhir95jU5qB709FAuqrV7eZ-8'
  const contaienr = document.getElementById('cesium-container');
  (contaienr as any).innerHTML = ''
  // 初始化配置
  const viewerDiv = document.createElement('div')
  viewerDiv.style.width = '100%'
  viewerDiv.style.height = '100%'

  contaienr?.appendChild(viewerDiv)

  // 初始化配置
  const viewer = new Cesium.Viewer(viewerDiv, {
    animation: false,
    homeButton: false, // home键
    geocoder: false, // 地址编码
    baseLayerPicker: false, // 图层选择控件
    timeline: false, // 时间轴
    fullscreenButton: false, // 全屏显示
    infoBox: false, // 点击要素之后浮窗
    sceneModePicker: false, // 投影方式  三维/二维
    navigationInstructionsInitiallyVisible: false, // 导航指令
    navigationHelpButton: false, // 帮助信息
    selectionIndicator: false, // 选择
    shouldAnimate: true,
    requestRenderMode: false // 减少Cesium渲染新帧总时间并减少Cesium在应用程序中总体CPU使用率
  })

  // 存储viewer实例
  store.dispatch('cesium/setInstance', viewer)

  loadExample()
  initViwerConfig(viewer)
  // 注册地图事件
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  // 注册自定义封装工具
  const utils = cesiumUnits()
  // 注册鼠标左键点击事件
  const arr:any = []
  handler.setInputAction(async(movement) => {
    // 获取加载地形后对应的经纬度和高程：地标坐标
    // var ray = viewer.camera.getPickRay(movement.position)
    // var position = viewer.scene.globe.pick(ray, viewer.scene)

    // 获取鼠标点的对应椭球面位置：世界坐标（Cartesian3）
    // var position2 = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid)

    // 获取倾斜摄影或模型点击处的坐标：场景坐标
    // var position3 = viewer.scene.pickPosition(movement.position)

    const lnglat = utils.turnLnglat(movement.position)
    console.log(`地图坐标拾取:${lnglat.lng},${lnglat.lat},${lnglat.height}`)
    arr.push({ lng: lnglat.lng, lat: lnglat.lat })
    if (arr.length === 60) {
      console.log(JSON.stringify(arr))
    }
    const pickingEntity = viewer.scene.pick(movement.position)

    mapEventTransit(movement)
    mapClick(movement)
    /**
     * 3D高亮显示 Cesium3DTileFeature
     * tilesetHighlightEvent
     */
    // tilesetHighlightEvent(pickingEntity)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  // 注册鼠标移动事件
  handler.setInputAction((movement) => {
    mouseOverHandler(movement)
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  // 设置相机视角
  viewer.camera.setView({
    // destination: Cesium.Cartesian3.fromDegrees(121.14452515163272, 27.826525896788148, 800), // 洞头东屏街道
    destination: Cesium.Cartesian3.fromDegrees(120.56726020487443, 27.57274638881502, 3000), //  温州鹿城区
    // destination: Cesium.Cartesian3.fromDegrees(112.40877399495588, 19.3527135036516, 1559486), // 测试台风轨迹
    // destination: Cesium.Cartesian3.fromDegrees(118.87841653400005, 30.95679870500004, 40000), // 测试运动轨迹
    //  经纬度,相机高度  121.06567996933468, 27.468616055651257, 800  // 129.06567996933468, 24.148726649017675, 1000000
    orientation: {
      heading: Cesium.Math.toRadians(0.0), // 相机方向
      pitch: Cesium.Math.toRadians(-90) // 倾斜角度
    }
  })
}

/**
 * 加载测试用例
 */
const loadExample = () => {
  // 加载天地图影像
  // initTdtImageLayout()
  // 加载外网公开发布的Arcgis图层
  // initArcgisLayout()
  // 超图 - 加载必应全球影像地图
  // initWorldImagery()
  // 超图 - 加载东屏倾斜影像
  // initDongPingS3MLayout()
  initAggregationPoint()
  initMapBoxLayout()

  //
}

/**
 * 关于场景的初始化配置
 */
const initViwerConfig = (viewer) => {
  // 禁止缩放
  // viewer.scene.screenSpaceCameraController.enableZoom = false
  // 隐藏cesium ion
  viewer._cesiumWidget._creditContainer.style.display = 'none'
  // 开启地形检测
  // viewer.scene.globe.depthTestAgainstTerrain = true // 默认为false
}

