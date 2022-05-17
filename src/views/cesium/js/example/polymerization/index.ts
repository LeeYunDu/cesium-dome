import { getCesium, getInstance } from '../../cesiumUnit'

/**
 * 点位聚合
 * 作者:李云都
 * 时间:2021-11-25
 */
export function drawPolymerizationPoint() {
  const Cesium = getCesium()
  const viewer = getInstance()
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

  handler.setInputAction(async(scrollValue) => {
    console.log(scrollValue, 'scrollValue ')
  }, Cesium.ScreenSpaceEventType.WHEEL)
}
