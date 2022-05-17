
import { getCesium, getInstance } from '../../cesiumUnit'
import colors from './colors.jpg'
import color from './color.jpg'
import color2 from './color2.png'
import color3 from './color3.png'
function createFlowLineMaterial() {
  const Cesium = getCesium()

  class FlowLineTrailMaterialProperty {
    constructor(options) {
      options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT)
      this._definitionChanged = new Cesium.Event()
      this._color = undefined
      this._colorSubscription = undefined
      this.color = options.color
      this.duration = options.duration
      this.trailImage = options.trailImage
      this._time = performance.now()
    }
  }

  Object.defineProperties(FlowLineTrailMaterialProperty.prototype, {
    isConstant: {
      get: function() {
        return false
      }
    },
    definitionChanged: {
      get: function() {
        return this._definitionChanged
      }
    },
    color: Cesium.createPropertyDescriptor('color')
  })

  FlowLineTrailMaterialProperty.prototype.getType = function(time) {
    return 'FlowLineTrail'
  }

  FlowLineTrailMaterialProperty.prototype.getValue = function(time, result) {
    if (!Cesium.defined(result)) {
      result = {}
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color)
    // result.image = Cesium.Material.FlowLineTrailImage;
    result.image = this.trailImage
    result.time = ((performance.now() - this._time) % this.duration) / this.duration
    return result
  }

  FlowLineTrailMaterialProperty.prototype.equals = function(other) {
    return this === other || (other instanceof FlowLineTrailMaterialProperty && Cesium.Property.equals(this._color, other._color))
  }

  Cesium.Material.FlowLineTrailType = 'FlowLineTrail'

  Cesium.Material.FlowLineTrailImage = colors

  // Cesium.Material.FlowLineTrailSource = `
  //   czm_material czm_getMaterial(czm_materialInput materialInput)\n\
  //   {\n\
  //   czm_material material = czm_getDefaultMaterial(materialInput);\n\
  //   vec2 st = materialInput.st;\n\
  //   vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
  //   material.alpha = colorImage.a * color.a;\n\
  //   material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
  //   return material;\n\
  //   }
  // `

  /**
   * 其实我们只是想要在S轴上进行纹理重复，
   * 其实我们只需要将st.s10.0就可以了，
   * 更推荐这样写：
   *  vec2 st = materialInput.st;
   * vec4 colorImage = texture2D(image, vec2(fract(st.s10.0-time10.0), st.t));
   * time10.0 是加快time变化的周期，乘的数值越大变化速率越快。也可以改变纹理图的颜色，
   * 如上所示rgb采用自己想要的颜色值，透明度值采用纹理的透明度值。
   */
  Cesium.Material.FlowLineTrailSource = `
  \
 uniform vec4 color;\n\
  uniform float time;\n\
  uniform sampler2D image;\n\
  czm_material czm_getMaterial(czm_materialInput materialInput)\n\
  {\n\
     czm_material material = czm_getDefaultMaterial(materialInput);\n\
     vec2 st = materialInput.st * 2.0;\n\
     vec4 colorImage = texture2D(image, vec2(fract(st.s*1.0 - time*10.0), st.t));\n\
     material.alpha = colorImage.a * color.a;\n\
     material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
     return material;\n\
  }
  `

  Cesium.Material._materialCache.addMaterial(Cesium.Material.FlowLineTrailType, {

    fabric: {
      type: Cesium.Material.FlowLineTrailType,
      uniforms: {
        color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
        image: Cesium.Material.FlowLineTrailImage,
        time: 0
      },
      source: Cesium.Material.FlowLineTrailSource
    },
    translucent: function(material) {
      return true
    }
  })

  Cesium.FlowLineTrailMaterialProperty = FlowLineTrailMaterialProperty
}

const load = false
export function drawFlowLine() {
  const Cesium = getCesium()
  const viewer = getInstance()
  setView()

  if (load) {
    return
  }
  createFlowLineMaterial()
  // const mm = parabola([113.28440447584667, 23.118272208054833, 119.26104388028811, 26.041728581697427])
  const mm2 = [
    120.67038697163908, 27.99926320657932,
    120.67572607104071, 27.98231812368885,
    120.68504677848811, 27.982073864751634,
    120.6851910721539, 27.987039390264936,
    120.69418187033547, 27.986915437240782,
    120.69279578128149, 27.999623452806077,
    120.6576853039223, 27.998168143297843,
    120.6588757856293, 27.99190018532568
  ]
  const material = new Cesium.FlowLineTrailMaterialProperty({
    color: Cesium.Color.RED, // 该材质直接采用该字段
    duration: 3000,
    trailImage: color2
  })

  viewer.entities.add({
    polyline: {
      // positions: mm,
      positions: Cesium.Cartesian3.fromDegreesArray(mm2),
      width: 2,
      material: material
    }
  })
}

function parabola(twoPoints) { // 抛物线绘制
  const Cesium = getCesium()
  let s = []
  const startPoint = [twoPoints[0], twoPoints[1], 0] // 起点的经度、纬度
  s = s.concat(startPoint)
  const step = 80 // 线的多少，越多则越平滑(但过多浏览器缓存也会占用越多)
  const heightProportion = 0.125 // 最高点和总距离的比值
  const dLon = (twoPoints[2] - startPoint[0]) / step // 经度差值
  const dLat = (twoPoints[3] - startPoint[1]) / step // 纬度差值
  const deltaLon = dLon * Math.abs(111000 * Math.cos(twoPoints[1])) // 经度差(米级)
  const deltaLat = dLat * 111000 // 纬度差(米),1纬度相差约111000米
  const endPoint = [0, 0, 0] // 定义一个端点（后面将进行startPoint和endPoint两点画线）
  const heigh = ((step * Math.sqrt(deltaLon * deltaLon + deltaLat * deltaLat) * heightProportion)).toFixed(0) * 2
  const x2 = (10000 * Math.sqrt(dLon * dLon + dLat * dLat)) // 小数点扩大10000倍，提高精确度
  const a = (heigh / (x2 * x2))
  function y(x, height) { return height - a * x * x }
  for (var i = 1; i <= step; i++) { // 逐“帧”画线
    endPoint[0] = startPoint[0] + dLon // 更新end点经度
    endPoint[1] = startPoint[1] + dLat // 更新end点纬度
    const x = x2 * (2 * i / step - 1) // 求抛物线函数x
    endPoint[2] = ((y(x, heigh))).toFixed(0) * 1 // 求end点高度
    s = s.concat(endPoint)

    // end点变为start点
    startPoint[0] = endPoint[0]
    startPoint[1] = endPoint[1]
    startPoint[2] = endPoint[2]
  }
  return Cesium.Cartesian3.fromDegreesArrayHeights(s)
}

function setView() {
  const viewer = getInstance()
  const Cesium = getCesium()

  // 设置相机视角
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(120.6852797457469, 27.983078486746134, 23000),
    orientation: {
      heading: Cesium.Math.toRadians(0.0), // 相机方向
      pitch: Cesium.Math.toRadians(-90) // 倾斜角度
    }
  })
}
