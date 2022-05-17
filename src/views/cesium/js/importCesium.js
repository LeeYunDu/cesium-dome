/* eslint-disable no-undef */

export function injectCesium(ak) {
  return new Promise((resolve, reject) => {
    let load = false
    // 如果已加载直接返回
    if (typeof Cesium !== 'undefined') {
      resolve(Cesium)
      return true
    }
    // 异步加载回调处理
    window.onload = () => {
      load = true
      resolve(Cesium)
    }

    // 注入script脚本
    // const script = document.createElement('script')
    // script.src = `https://cesium.com/downloads/cesiumjs/releases/1.82/Build/Cesium/Cesium.js`
    // script.doneState = { loaded: true, complete: true }
    // const css = document.createElement('link')
    // css.href = `https://cesium.com/downloads/cesiumjs/releases/1.82/Build/Cesium/Widgets/widgets.css`
    // css.rel = 'stylesheet'
    // document.body.appendChild(script)
    // document.head.appendChild(css)
    // // 避免未触发window.onload方法
    // setTimeout(() => {
    //   if (!load) {
    //     if (Cesium) {
    //       resolve(Cesium)
    //     }
    //   }
    // }, 10000)
    // script.onload = () => {
    //   console.log('script onload')
    //   load = true
    //   resolve(Cesium)
    // }
  })
}
