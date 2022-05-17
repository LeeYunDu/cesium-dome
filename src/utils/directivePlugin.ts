/*
*说明: 全局指令注入
*创建者: 李云都
*日期: 2021-08-03
*/

// vue3指令教学地址  https://blog.csdn.net/qq_41996454/article/details/114075758

import verifyRole from '@/directive/verifyRole'

const directivePlugin = {
  install(app) {
    app.directive('width', {

      mounted(el, binding) {
        console.log(el, binding, '指令width')
        // el:imgdom对象
        // binding: value 表达式值
        // 使用监听函数 在满足条件的情况下 把binding.value 交给 el的src属性
      }
    })

    app.directive('test', {

      mounted(el, binding) {
        console.log(el, binding, '指令test')
        // el:imgdom对象
        // binding: value 表达式值
        // 使用监听函数 在满足条件的情况下 把binding.value 交给 el的src属性
      }
    })

    // 字段信息展示判断是否为空值
    app.directive('isEmpty', {

      mounted(el, binding) {
        const object = binding.value
        if (object === '' || object === undefined || object == null || JSON.stringify(object) === '{}' || JSON.stringify(object) === '[]') {
          el.innerHTML = '/'
        } else {
          el.innerHTML = object
        }
        // el:img dom对象
        // binding: value 表达式值
        // 使用监听函数 在满足条件的情况下 把binding.value 交给 el的src属性
      }
    })

    // 根据角色按钮配置来控制是否显示
    app.directive('verifyRole', verifyRole)
  }
}

export default directivePlugin
