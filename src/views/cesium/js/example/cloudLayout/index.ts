/**
 * Cesium 动态效果库
 * 作者：李云都
 * 时间 2021-11-11
 */
import { getInstance, getCesium } from '../../cesiumUnit'

let load = false
// 加载大气云层效果
export function loadCloudLayout() {
  const viewer = getInstance()
  const Cesium = getCesium()
  if (load) {
    // 设置相机视角
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(117.48, 30.67, 18000000.0),
      orientation: {
        // 指向
        heading: Cesium.Math.toRadians(0, 0),
        // 视角
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0
      }

    })
    return
  }

  const cloudImg = require('../../../img/earthclouds1k.jpg')

  var rectangle = viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
          rectangle: Cesium.Rectangle.fromDegrees( // 创建一个矩形 覆盖整个地球
            -180.0,
            -90,
            180.0,
            90),
          // vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
          height: 300000
        })
      }),
      appearance: new Cesium.EllipsoidSurfaceAppearance({
        aboveGround: true
      })
    })
  )

  // 添加一张 天气图的材质
  rectangle.appearance.material = new Cesium.Material({
    fabric: {
      type: 'Image',
      uniforms: {
        image: cloudImg,
        radians: 0
      },
      // 看不懂
      source: `
       #define M_PI 3.1415926535897932384626433832795
 
       uniform sampler2D image;
       uniform float radians;
       
       czm_material czm_getMaterial(czm_materialInput materialInput)
       {
         czm_material material = czm_getDefaultMaterial(materialInput);
         vec2 st = vec2(materialInput.st.x - 0.5, materialInput.st.y - 0.5);
         float alpha = 0.2;
         float current_radians = atan(st.y, st.x);
         float radius = sqrt(st.x * st.x + st.y * st.y);
         if (radius < 0.50) {
           current_radians = current_radians - radians;
           st = vec2(cos(current_radians) * radius, sin(current_radians) * radius);
           st = vec2(st.x + 0.5, st.y + 0.5);
           vec4 colorImage = texture2D(image, st);
           material.diffuse = colorImage.rgb;
           material.alpha = colorImage.a * alpha;
         } else {
           material.alpha = 0.2;
         }
 
         return material;
       }
       `
    },
    translucent: true
  })
  let radians = 0
  // 实时刷新
  viewer.scene.postUpdate.addEventListener(() => {
    radians += Math.PI / 4500 // 控制云层动态速度
    rectangle.appearance.material.uniforms.radians = radians
  })
  // 设置相机视角
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(117.48, 30.67, 18000000.0),
    orientation: {
      // 指向
      heading: Cesium.Math.toRadians(0, 0),
      // 视角
      pitch: Cesium.Math.toRadians(-90),
      roll: 0.0
    }

  })
  load = true
}

