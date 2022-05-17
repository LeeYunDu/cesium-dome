/**
 * 去扫描 views 文件夹,存在 initModule.ts文件的模块
 */

const modules = {}

const componentsContext = require.context('@/views', true, /\initModule.ts$/)

componentsContext.keys().forEach(component => {
  // 计算出模块的名称
  const endIndex = component.indexOf('initModule.ts')
  const key = component.slice(2, endIndex - 1)
  // 获取模块的配置
  const module = componentsContext(component).default()
  modules[key] = module
})

export default modules
