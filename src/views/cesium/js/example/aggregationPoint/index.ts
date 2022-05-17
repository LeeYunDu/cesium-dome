import { getCesium, getInstance } from '../../cesiumUnit'

import traceability from './image/traceability.png'
import traffic from './image/traffic.png'
import collect from './image/collect.png'
import warehouse from './image/warehouse.png'
import isolated from './image/isolated.png'
import sampling from './image/sampling.png'

const imageMap = {
  traceability, traffic, warehouse, collect, isolated, sampling
}
export function initAggregationPoint() {
  const data = [{ 'lng': 120.68822205317751, 'lat': 27.979081207855927 }, { 'lng': 120.68590919528677, 'lat': 27.976161859295498 }, { 'lng': 120.67915013908298, 'lat': 27.975620028527242 }, { 'lng': 120.6821958122613, 'lat': 27.97340438134438 }, { 'lng': 120.68834624073943, 'lat': 27.971946072648254 }, { 'lng': 120.69608493623447, 'lat': 27.969558485844928 }, { 'lng': 120.70296452121684, 'lat': 27.96961328084875 }, { 'lng': 120.72037623051959, 'lat': 27.978910788025004 }, { 'lng': 120.72165450775583, 'lat': 27.97339739017883 }, { 'lng': 120.73017748917795, 'lat': 27.970153823423217 }, { 'lng': 120.73908324933784, 'lat': 27.974989934265068 }, { 'lng': 120.72800301209922, 'lat': 27.982072129579816 }, { 'lng': 120.71941793278624, 'lat': 27.986288848403056 }, { 'lng': 120.68970092649417, 'lat': 27.989639101834793 }, { 'lng': 120.66844630340407, 'lat': 27.98558102469602 }, { 'lng': 120.66668216953933, 'lat': 27.981688021923144 }, { 'lng': 120.65766887423563, 'lat': 27.977846996249763 }, { 'lng': 120.65389360711855, 'lat': 27.97498029534018 }, { 'lng': 120.66419106726194, 'lat': 27.97087503435804 }, { 'lng': 120.68477264856061, 'lat': 27.977529212740972 }, { 'lng': 120.69390486916106, 'lat': 27.983530819501436 }, { 'lng': 120.71844376353341, 'lat': 27.984937480613738 }, { 'lng': 120.74036335381018, 'lat': 27.979638568487907 }, { 'lng': 120.74437973870884, 'lat': 27.971529719622303 }, { 'lng': 120.74906737867579, 'lat': 27.9688801719159 }, { 'lng': 120.77019921890987, 'lat': 27.968604025226924 }, { 'lng': 120.71310351157828, 'lat': 27.96023721079428 }, { 'lng': 120.69207854047369, 'lat': 27.954820045880233 }, { 'lng': 120.71958437336404, 'lat': 27.935572302590163 }, { 'lng': 120.75838764436493, 'lat': 27.940980086581582 }, { 'lng': 120.78563896215206, 'lat': 27.932094398179544 }, { 'lng': 120.76086329879553, 'lat': 27.929684335693107 }, { 'lng': 120.72365371974934, 'lat': 27.94995521819396 }, { 'lng': 120.65867702679049, 'lat': 27.945765047262032 }, { 'lng': 120.62818015336386, 'lat': 27.9435679773736 }, { 'lng': 120.61727320049594, 'lat': 27.94656129402421 }, { 'lng': 120.59818394815434, 'lat': 27.948744361339163 }, { 'lng': 120.63337929680534, 'lat': 27.934579899207442 }, { 'lng': 120.68942952857962, 'lat': 27.94357859824547 }, { 'lng': 120.7031830594942, 'lat': 27.952107159178592 }, { 'lng': 120.61700882788661, 'lat': 27.950941508177113 }, { 'lng': 120.61857284152997, 'lat': 27.945178535243905 }, { 'lng': 120.66426420580193, 'lat': 27.928134277955163 }, { 'lng': 120.69643095268101, 'lat': 27.942664495342665 }, { 'lng': 120.5530178548487, 'lat': 28.005367929920943 }, { 'lng': 120.46400727423203, 'lat': 28.00726828274842 }, { 'lng': 120.48525120746703, 'lat': 27.97873111831608 }, { 'lng': 120.48003783544992, 'lat': 27.960011145148513 }, { 'lng': 120.66146120231384, 'lat': 27.967358280290668 }, { 'lng': 120.86750454236713, 'lat': 27.956917540262435 }, { 'lng': 120.93401902295254, 'lat': 27.973355095520283 }, { 'lng': 120.93770288851859, 'lat': 28.016162703079807 }, { 'lng': 120.83292909073671, 'lat': 28.02826112520019 }, { 'lng': 120.68742162004463, 'lat': 28.028246317924545 }, { 'lng': 120.85027574661487, 'lat': 28.03524661510444 }, { 'lng': 120.56344361860677, 'lat': 28.01613576753928 }, { 'lng': 120.58035426983699, 'lat': 27.927943228880043 }, { 'lng': 120.75878147403151, 'lat': 27.941781364102596 }, { 'lng': 120.86801722577663, 'lat': 28.00322001651991 }, { 'lng': 120.95254021104618, 'lat': 28.02526172139059 }]

  const Cesium = getCesium()
  const viewer = getInstance()

  // 创建数据源
  const dataSource = new Cesium.CustomDataSource('test')
  const clusterPoint = new ClusterPoint(data, {
    name: 'customDataSource',
    image: traceability,
    clusterMarker: traffic,
    imageWidth: 17,
    imageHeight: 17
  })
}

interface ClusterOption{
  image:string ;// 点位展示的图片
  imageWidth:number;// 点位展示的图片的宽度
  imageHeight:number; // 点位展示的图片的宽度
  callback?:Function;// 点位的点击事件

  name?:string// dataSource 的名称

  clusterMarker?:any;// 聚合点位的icon
  pixelRange?:number; // 像素范围
  minimumClusterSize?:number;// 最小聚合点位
  enabled?:boolean; // 聚合是否有效

}
// 聚合点位
export class ClusterPoint {
  public points // 点位集合
  public Cesium
  public viewer
  public dataSource // 数据源
  public option:ClusterOption

  public removeListener

  // 点位数据
  constructor(points, option:ClusterOption) {
    this.Cesium = getCesium()
    this.viewer = getInstance()
    this.option = option
    this.createDataSource(points)
  }

  createDataSource(points) {
    // 名称
    const dataSourceName = this.option.name || new Date().getTime()
    const dataSource = new this.Cesium.CustomDataSource(dataSourceName)
    points.forEach((element, index) => {
      if (element.lat) {
        const entity = {
          show: true,
          position: this.Cesium.Cartesian3.fromDegrees(element.lng, element.lat, 50),
          attrs: element, // 点位信息
          onClick: this.option.callback, // 回调函数
          billboard: {
            image: this.option.image,
            show: true,
            width: this.option.imageWidth,
            height: this.option.imageHeight
          }
        }
        dataSource.entities.add(entity)
      }
    })
    // 关于聚合点位配置
    dataSource.clustering.enabled = this.option.enabled || true
    dataSource.clustering.pixelRange = this.option.pixelRange || 59
    dataSource.clustering.minimumClusterSize = this.option.minimumClusterSize || 2
    // 点位数据添加到场景中
    this.dataSource = dataSource
    this.viewer.dataSources.add(dataSource)
    this.customStyle()
  }

  // 自定义聚合点位图标
  customStyle() {
    const Cesium = this.Cesium
    if (Cesium.defined(this.removeListener)) {
      this.removeListener()
      this.removeListener = undefined
    } else {
      this.removeListener = this.dataSource.clustering.clusterEvent.addEventListener(
        async(clusteredEntities, cluster) => {
          cluster.label.show = false
          cluster.billboard.show = true
          cluster.billboard.id = cluster.label.id
          cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM
          // 聚合点位数量限制
          if (clusteredEntities.length >= 99) {
            cluster.billboard.image = await this.drawClusterMarker('99+')
          } else {
            cluster.billboard.image = await this.drawClusterMarker(clusteredEntities.length)
          }
        }
      )
    }
    // 聚合点位配置
    // force a re-cluster with the new styling
    var pixelRange = this.dataSource.clustering.pixelRange
    this.dataSource.clustering.pixelRange = 0
    this.dataSource.clustering.pixelRange = pixelRange
  }

  // 绘制聚合点位图标
  drawClusterMarker(count) {
    return new Promise((resolve, reject) => {
      var canvas:any = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const radio = 1
      var image = new Image()
      // 如果没有配置聚合点位图标则显示图标的图片
      image.src = this.option.clusterMarker || this.option.image
      image.onload = function() {
        // 处理canvas宽度
        canvas.width = image.width * radio
        canvas.height = image.height * radio
        // 绘制图片
        ctx.drawImage(image, 0, 0, image.width * radio, image.height * radio)
        // 绘制聚合点位的数量
        ctx.font = '18px "微软雅黑"'
        ctx.fillStyle = 'black'
        ctx.textBaseline = 'center'
        ctx.textAlign = 'center'
        // 居中显示
        ctx.fillText(count, image.width / 2, (image.height / 2) + 9)
        // 抛出图片
        var tempSrc = canvas.toDataURL('image/png')
        resolve(tempSrc)
      }
    })
  }

  // 删除数据
  remove() {
    this.viewer.dataSources.remove(this.dataSource)
  }
}

