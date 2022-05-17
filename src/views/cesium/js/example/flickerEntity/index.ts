
/**
 * 作者：李云都
 * 时间：2021-11-20
 * Cesium 动画原理
 * CallbackProperty是一个类，其值由回调函数延迟计算。也就是说它在不断地自我调用，每当期返回的对象有改变，就抛出改编后的值。
 * 利用这种特性，我们就可以在定义材质时，用CallbackProperty生成动态的对象赋值给材质参数，就可以得到动态材质的效果。
 * CallbackProperty(动画效果函数, isConstant)中，isConstant是用来判断函数返回的值是否要更新到渲染中去。
 * 判断的标准是否很简单，就是预先指定返回的值是变还是不变的。例如代码中每次返回的坐应该都是变的，所以应该设置成false，也是就，返回的值是连续变化的。
 * 当返回不变的值时，即可不更新渲染数据（从实验得到的结果是这样的，不知道理解是否正确）。
 */
import { getCesium, getInstance } from '../../cesiumUnit'
import icon from './VIP.png'

/**
 * 闪烁点
 * 通过CallbackProperty 控制 material的透明度 来达到闪烁效果
 */
export function flickerPoint() {
  const Cesium = getCesium()
  const viewer = getInstance()
  setView()
  var x = 1
  var flog = true
  viewer.entities.add({
    name: '闪烁点',
    position: Cesium.Cartesian3.fromDegrees(112.0694463910405, 19.893381826470723, 10),
    point: {
      color: new Cesium.CallbackProperty(function() {
        if (flog) {
          x = x - 0.05
          if (x <= 0) {
            flog = false
          }
        } else {
          x = x + 0.05
          if (x >= 1) {
            flog = true
          }
        }
        return Cesium.Color.RED.withAlpha(x)
      }, false),
      pixelSize: 30, // default: 1
      outlineWidth: 0
    }
  })
}

/**
 * 闪烁面
 * 通过CallbackProperty 控制 material的透明度 来达到闪烁效果
 */
export function flickerEllipse() {
  const Cesium = getCesium()
  const viewer = getInstance()
  setView()

  var x = 1
  var flog = true
  viewer.entities.add({
    name: '圆形区域闪烁',
    position: Cesium.Cartesian3.fromDegrees(115.10217432544997, 18.57316632062252, 0),
    ellipse: {
      semiMinorAxis: 20000.0,
      semiMajorAxis: 20000.0,
      height: 0,
      material: new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function() {
        if (flog) {
          x = x - 0.05
          if (x <= 0) {
            flog = false
          }
        } else {
          x = x + 0.05
          if (x >= 1) {
            flog = true
          }
        }
        return Cesium.Color.RED.withAlpha(x)
      }, false))
    }
  })
}

/**
 * 闪烁billboard
 * 通过 CallbackProperty 控制shou 来达到闪烁的效果
 */
export function flickerBillboard() {
  const Cesium = getCesium()
  const viewer = getInstance()
  setView()
  var x = 1
  var flog = true
  viewer.entities.add({
    name: 'singleWarning',
    position: Cesium.Cartesian3.fromDegrees(116.35169264744222, 20.117191488199246),
    billboard: {
      image: icon,
      name: 'singleWarning',
      show: new Cesium.CallbackProperty(function() {
        if (flog) {
          x = x - 0.05
          if (x <= 0) {
            flog = false
          }
        } else {
          x = x + 0.05
          if (x >= 1) {
            flog = true
          }
        }
        return x >= 0.5
      }, false),
      width: 100,
      height: 100,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 6.8e10)
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
