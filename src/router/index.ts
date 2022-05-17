import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { beforeEach, afterEach } from './permission'
import layout from '@/layout/index.vue'
import store from '@/store'

// 载入组件

export const getParentLayout = (path?: string) => {
  return () =>
    new Promise((resolve) => {
      const compoment = require(`@/views${path}`)
      resolve(compoment)
    })
}

export const constantRouterMap: Array<RouteRecordRaw> = [

  {
    path: '/',
    component: layout,
    redirect: '/cesium',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
      meta: { title: '首页', redirect: '/dashboard' }
    }]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/default/loginPig/index.vue')
  },
  {
    path: '/cesium',
    name: 'Cesium',
    component: () => import(/* webpackChunkName: "cesium" */ '@/views/cesium/index.vue')
  },
  // 单点登录地址
  {
    path: '/freeLogin',
    name: 'freeLogin',
    component: () => import(/* webpackChunkName: "freeLogin" */ '@/views/default/freeLogin/index.vue')
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/default/errpage/404.vue')
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/default/errpage/401.vue')
  },
  {
    path: '/remark',
    // component: () => import(/* webpackChunkName: "401" */ '@/views/default/remark/index.vue')

    component: getParentLayout('views/default/remark/index.vue')
  },
  // 路由404注释 因为 动态路由页面刷新的时候 会跳转至404页面 这个bug暂时无法修复
  {
    path: '/:pathMath(.*)',
    component: () => import(/* webpackChunkName: "404" */ '@/views/default/errpage/404.vue'),
    name: 'notFound'
  }
]

export function initRouter(modules) {
  return new Promise((resolve, reject) => {
    const allowVisitRoute:string[] = []
    const routeGroup:any = [] // 路由配置
    modules.forEach(element => {
      // 拼接父级路由
      const routerItem:RouteRecordRaw = {
        path: `/${element.mark}`,
        name: `${element.mark}`,
        component: layout,
        meta: {
          title: element.name,
          redirect: 'noRedirect',
          hide: false,
          sort: element.sort
        },
        children: []
      }

      // 拼接子路由

      if (element.children.length > 0) {
        const childrens:any = []
        // 如果子模块的状态值 state = '1' 的时候 表示改模块正常启用
        element.children = element.children.filter(children => {
          return children.state === '1'
        })
        element.children.forEach((children, index) => {
          try {
            // 模块路由重定向至子路由的第一个
            if (index === 0) {
              routerItem.redirect = `${routerItem.path}/${children.mark}`
            }
            // 添加路由
            const childrenRouter = {
              path: `${children.mark}`,
              name: `${children.mark}`,
              component: getParentLayout(children.path),
              meta: {
                title: children.name,
                redirect: 'noRedirect',
                hide: false,
                sort: children.sort
              }
            }
            childrens.push(childrenRouter)
            allowVisitRoute.push(`${routerItem.path}/${children.mark}`)
          } catch (error) {
            console.log(error)
          }
        })

        // 模块排序
        childrens.sort((first, second) => {
          return first.sort - second.sort
        })

        routerItem.children = childrens
      }
      routeGroup.push(routerItem)
    })

    // 模块排序
    routeGroup.sort((first, second) => {
      return first.sort - second.sort
    })

    // 组合路由
    // const result = constantRouterMap.concat(routeGroup)

    routeGroup.forEach((element, index) => {
      // 路由注册
      router.addRoute(element)
    })
    // 存储可访问的路由路径
    store.dispatch('app/setData', { key: 'allowVisitRoute', value: allowVisitRoute })
    // 将路由存储起来,该数据侧边菜单栏会使用到
    store.dispatch('app/setRouter', routeGroup).then(() => {
      resolve(true)
    })
  })
}

/**
 * createWebHistory 不带#号
 * createWebHashHistory
 */
const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory((process.env.BASE_URL as any)),
  routes: constantRouterMap
})
router.beforeEach(beforeEach)
router.afterEach(afterEach)
export default router
