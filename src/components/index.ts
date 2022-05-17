
export const initGlobalComponents = (vue) => {
  // 自动加载 global 目录下的 .ts 结尾的文件
  const componentsContext = require.context('./global', true, /\.ts$/)
  componentsContext.keys().forEach(component => {
    const componentConfig = componentsContext(component)
    /**
  * 兼容 import export 和 require module.export 两种规范
  */
    const ctrl = componentConfig.default || componentConfig
    vue.component(ctrl.name, ctrl)
  })
}

