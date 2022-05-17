import { getToken, setToken } from '@/utils/auth' // get token from cookie

import { getSosAuthToken } from '@/api/token'
import store from '@/store'
import { initSystem } from '@/utils/system'
import { deleteUrlQuery } from '@/utils/util'
import { ElMessage } from 'element-plus'

const whiteList = ['/login', '/adminLogin', '/freeLogin', '/cesium'] // 路由白名单

/** 流程说明：
 * 1、判断token 不存在，跳登录页
 * 2、存在 判断vuex中的用户信息，不存在调用接口判断服务端是否登录，不存在util.js拦截axios响应跳转登录页
 * 3、用户服务端已登录，设置用户信息 加载路由、字典数据到vuex, next
 * 4、其他场景不赘述
*/
// router.beforeEach(async(to, from, next) => {
//   document.title = getPageTitle(to.meta.title)
//   next()
// })

export async function beforeEach(to, from, next) {
  if (getToken() || store.getters['user/token']) {
    // 存在token
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next()
      // next({ path: '/' })
    } else {
      // 有token 但是没有用户信息 则去获取
      const userInfo = store.state.user.userInfo
      if (userInfo === null || userInfo === undefined || JSON.stringify(userInfo) === '{}') {
        // 获取用户信息
        await store.dispatch('user/getInfo')
          .catch(async error => {
            await store.dispatch('user/logout')
            ElMessage.error(error)
            next({ path: '/' })
          })

        await initSystem(() => {
          /**
          * 如果是单点登录进来,判断是否携带redirect地址,再判断redirect地址是否在用户访问路由权限内
          * 如果不存在则跳转可访问路由的第一个
          */

          if (store.getters.freeLogin && to.fullPath !== '/') {
            // 获取可访问路由集合
            const paths = store.getters.allowVisitRoute
            if (paths.indexOf(to.fullPath) > -1) {
              next({
                path: to.fullPath,
                query: to.query
              })
            } else {
              next({
                path: paths[0],
                query: to.query
              })
            }
          } else {
            next({
              path: to.fullPath,
              query: to.query
            })
          }
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果是白名单
      next()
    } else {
      // TODO 重定向到门户登录地址
      // token失效跳回登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
}

export function afterEach() {
  // finish progress bar
  // NProgress.done()
}
