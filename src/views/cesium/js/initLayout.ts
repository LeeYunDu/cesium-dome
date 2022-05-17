/**
 * 加载各种图层
 * 作者：李云都
 * 时间 2021-11-05
 */

import store from '@/store'
import { getCesium, getInstance } from './cesiumUnit'

/**
 *  加载天地图影像地图
 * @param tiandituTk 天地图token
 * 还需要注入天地图 影像底图 插件脚本 http://api.tianditu.gov.cn/cdn/plugins/cesium/cesiumTdt.js
 */

export const initTdtImageLayout = () => {
  const Cesium = store.getters.Cesium
  const viewer = store.getters.viewer
  // 使用天地图影像地图需要携带Token 官网控制台注册账号后申请
  const tiandituTk = `f7068603b0188dd60578041bb44fb469`
  // 影像地图
  viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' + tiandituTk,
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    layer: 'tdtImgLayer',
    style: 'default',
    format: 'image/jpeg',
    tileMatrixSetID: 'GoogleMapsCompatible', // 使用谷歌的瓦片切片方式
    show: true
  }))
  // 影像注记
  viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=' + tiandituTk,
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    layer: 'tdtCiaLayer',
    style: 'default',
    format: 'image/jpeg',
    tileMatrixSetID: 'GoogleMapsCompatible',
    show: true
  }))
}

/**
 * 加载外网公开发布的 Arcgis 图层
 * 地址：http://map.geoq.cn/arcgis/rest/services
 * ChinaOnlineCommunity_Mobile (MapServer) 概述：彩色中文含兴趣点版高清中国基础地图
 * ChinaOnlineCommunityENG (MapServer) 概述：彩色英文含兴趣点版中国基础地图
 * ChinaOnlineCommunity (MapServer) 概述：彩色中文含兴趣点版中国基础地图
 * ChinaOnlineStreetGray (MapServer) 概述：灰色中文不含兴趣点版中国基础地图
 * ChinaOnlineStreetPurplishBlue (MapServer)  概述：蓝黑色中文不含兴趣点版中国基础地图
 * ChinaOnlineStreetWarm (MapServer) 概述：暖色中文不含兴趣点版中国基础地图
 */
export const initArcgisLayout = () => {
  const Cesium = store.getters.Cesium
  const viewer = store.getters.viewer
  viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
    url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
  }))
}

// 超图 - 加载必应全球影像地图 -  无标注
export const initWorldImagery = () => {
  const Cesium = store.getters.Cesium
  const viewer = store.getters.viewer
  const bingMap = viewer.imageryLayers.addImageryProvider(new Cesium.BingMapsImageryProvider({
    url: 'https://dev.virtualearth.net',
    mapStyle: Cesium.BingMapsStyle.AERIAL,
    key: 'AnnNEbBANf3y_eVVM0_QAtFH5uzVYQcEk7VR1E4u-TDGggaE5jsfLAcuJHVWpp-s'
  }))

  bingMap.alpha = 0.5 // 0.0  全透明.  1.0 不透明.
}

/**
 * https://server.arcgisonline.com/ArcGIS/rest/services
 * ArcGisMapServer是当前比较主流的GIS地图服务器
 * cesium 官方示例 - 引用到的图层
 */

/**
 * 加载东屏S3M格式图层
 */
export const initDongPingS3MLayout = () => {
  const Cesium = store.getters.Cesium
  const viewer = store.getters.viewer
  const scene = viewer.scene
  try {
    var promise = scene.open('http://10.36.213.21:8090/iserver/services/3D-dongping/rest/realspace')
    Cesium.when(promise, (layers) => {
      console.log(layers, 787878)
    })
    // var banpingdaoLayout = scene.addS3MTilesLayerByScp('http://10.36.213.21:8090/iserver/services/3D-dongping/rest/realspace/datas/banpingdao/config', {
    //   name: 'banpingdao'
    // })
    // var pmdx02 = scene.addS3MTilesLayerByScp('http://10.36.213.21:8090/iserver/services/3D-dongping/rest/realspace/datas/DL_1_1@pmdx02/config', {
    //   name: 'pmdx02'
    // })
    // var pmjz = scene.addS3MTilesLayerByScp('http://10.36.213.21:8090/iserver/services/3D-dongping/rest/realspace/datas/T06JZ_1_1@pmjz/config', {
    //   name: 'pmjz'
    // })
    // Cesium.when([banpingdaoLayout, pmdx02, pmjz], function(layers) {
    //   console.log(layers, 'layerslayers')

    //   var layer = scene.layers.find('Config')
    //   const sceneLayer = layer
    //   console.log('sceneLayer: ', sceneLayer)
    // })
  } catch (error) {
    console.log(error)
  }

  // 移除图层
  // scene.layers.remove('banpingdao', true)
}

/**
 * Cesium 加载mapbox自定义图层
 * styleId：map自定义图层的id
 * username：mapbox studio 用户名
 * accessToken:mapbox 生成的 token
 */
export const initMapBoxLayout = () => {
  const Cesium = getCesium()
  const viewer = getInstance()

  var mapbox = new Cesium.MapboxStyleImageryProvider({
    styleId: 'ckhn04m9p04qx19tjscdpo58d',
    username: 'liyundu',
    accessToken: 'pk.eyJ1IjoibGl5dW5kdSIsImEiOiJja2dmeWhpOHMwZzZ4MnRvYm9zMGJpODdmIn0.pr0Q6ofXmvCtJvHSIY7-MA'
  })

  viewer.imageryLayers.addImageryProvider(mapbox)
}
