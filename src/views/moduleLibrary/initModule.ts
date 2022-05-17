
import { module, children, meta } from '@/interface/route'

const moduleKey = 'moduleLibrary' // 模块名称
const config = require('@/routerConfig')[moduleKey] // 获取模块下的配置

const modules:Array<children> = []
const requireComponent = require.context('./', true, /\main.vue$/)
requireComponent.keys().forEach(key => {
  // 下标
  const endIndex = key.indexOf('main.vue')
  const startIndex = './modules/'
  // 获取子模块名称
  const childrenName = key.slice(startIndex.length, endIndex - 1)
  // 组件实例
  const component = requireComponent(key).default || requireComponent(key)
  // 获取子路由meta配置
  let meta:meta

  if (childrenName in config) {
    meta = config[childrenName] || {}
  } else {
    // meta默认配置
    meta = {
      sort: 99,
      title: '未定义模块名称'
    }
  }
  // 拼接成子路由所需要的字段
  const childrenItem:children = {
    name: childrenName,
    fileName: 'main',
    components: component, // 组件实例
    filePath: component['__file'],
    meta: meta
  }

  modules.push(childrenItem)
})
// 返回一个路由
export default function() {
  const result:module = {
    title: '模块案例',
    meta: { title: '模块案例', redirect: 'noRedirect', hide: false },
    children: modules,
    sort: 1 // 模块排序
  }
  return result
}
