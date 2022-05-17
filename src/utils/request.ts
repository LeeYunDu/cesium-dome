import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'
const serverUrl = process.env.VUE_APP_BASE_API

const service = axios.create({
  baseURL: serverUrl,
  timeout: 60000, // request timeout
  withCredentials: false
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers.Authorization = `Basic dGVzdDp0ZXN0`
    // do something before request is sent
    if (getToken()) {
      config.headers.Authorization = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const status = Number(response.status) || 200
    const res = response.data

    if (status === 401) {
      store.dispatch('logout').then(() => {
        router.push({ path: '/login' })
      })
      return
    }
    if (status !== 200 || response.data.code === 1) {
      ElMessage({
        message: 'network error',
        type: 'error'
      })
      return Promise.reject(new Error('network error'))
    }

    // if (!res.success) {
    //   // 登录失效
    //   if (res.state === 4 || res.state === '4') {
    //     console.log('登录失效')
    //   } else if (res.code === 0) {
    //     return res
    //   } else {
    //     ElMessage({
    //       message: res.msg,
    //       type: 'error',
    //       duration: 3 * 1000
    //     })
    //   }
    // }
    return res
  },
  error => {
    const state = error.response.status
    console.log('err' + error) // for debug
    // 身份验证失败
    if (state === 401) {
      store.dispatch('user/logout').then(() => {
        location.reload()
      })
    }
    ElMessage({
      message: error.response.data.msg,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
