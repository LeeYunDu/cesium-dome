/**
 * 添加自定义material
 * 作者：李云都
 * 时间 2021-11-20
 */
import { getCesium, getInstance } from '../../cesiumUnit'
import img from './icon-test3.jpg'
const load = false
export function createPolyLineMaterial() {
  setView()

  if (load) {
    return
  }
  const Cesium = getCesium()
  const viewer = getInstance()
  function PolylineTrailLinkMaterialProperty(color, duration) {
    this._definitionChanged = new Cesium.Event()
    this._color = undefined
    this._colorSubscription = undefined
    this.color = color
    this.duration = duration
    this._time = new Date().getTime()
  }
  Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
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
  PolylineTrailLinkMaterialProperty.prototype.getType = function(time) {
    return 'PolylineTrailLink'
  }
  PolylineTrailLinkMaterialProperty.prototype.getValue = function(
    time,
    result
  ) {
    if (!Cesium.defined(result)) {
      result = {}
    }
    result.color = new Cesium.Property.getValueOrClonedDefault(
      this._color,
      time,
      Cesium.Color.WHITE,
      result.color
    )
    result.image = Cesium.Material.PolylineTrailLinkImage
    result.time =
      ((new Date().getTime() - this._time) % this.duration) / this.duration
    return result
  }
  PolylineTrailLinkMaterialProperty.prototype.equals = function(other) {
    return (
      this === other ||
      (other instanceof PolylineTrailLinkMaterialProperty &&
        Cesium.Property.equals(this._color, other._color))
    )
  }
  Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty
  Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink'
  Cesium.Material.PolylineTrailLinkImage = img
  Cesium.Material.PolylineTrailLinkSource =
    `czm_material czm_getMaterial(czm_materialInput materialInput)\n\
    {\n\
          czm_material material = czm_getDefaultMaterial(materialInput);\n\
          vec2 st = materialInput.st;\n\
          vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
          material.alpha = colorImage.a * color.a;\n\
          material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
          return material;\n\
      }`
  Cesium.Material._materialCache.addMaterial(
    Cesium.Material.PolylineTrailLinkType,
    {
      fabric: {
        type: Cesium.Material.PolylineTrailLinkType,
        uniforms: {
          color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
          image: Cesium.Material.PolylineTrailLinkImage,
          time: 0
        },
        source: Cesium.Material.PolylineTrailLinkSource
      },
      translucent: function(material) {
        return true
      }
    }
  )

  const material = new Cesium.PolylineTrailLinkMaterialProperty(
    Cesium.Color.BLUE,
    3000
  )

  viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([111.43740306388679, 20.37064404234424, 113.86763262371139, 19.570075952519982]),
      width: 2,
      material: material
    }
  })
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
