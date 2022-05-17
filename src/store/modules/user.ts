import { removeToken } from '@/utils/auth'
import { getToken, setToken } from '@/utils/auth'
import { login, getInfo } from '@/api/user'
import { encryption } from '@/utils/util'
import md5 from 'js-md5'
const state = {
  token: getToken(),
  roles: [],
  userInfo: null,
  depts: [],
  orgs: [],
  avatar: '',
  permissions: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_DEPTS: (state, depts) => {
    state.depts = depts
  },
  SET_ORGS: (state, orgs) => {
    state.orgs = orgs
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    const list = {}
    for (let i = 0; i < permissions.length; i++) {
      list[permissions[i]] = true
    }
    state.permissions = list
  }
}

const actions = {
  logout({ commit, dispatch }) {
    return new Promise(resolve => {
      removeToken()
      commit('SET_TOKEN', '')
      commit('SET_USERINFO', {})
      commit('SET_DEPTS', [])
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      resolve(true)
    })
  },
  login({ commit }, data) {
    // eslint-disable-next-line no-unused-vars
    const { username, password, mobile, SMScode, loginType, code, redomStr } = data
    const params = new URLSearchParams()
    params.append('username', username)
    const encrypted = md5(username + password)
    params.append('password', encrypted)
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async(resolve, reject) => {
      // token && (commit('SET_TOKEN', token) | setToken(token))
      // data && (commit('SET_USERINFO', data) | setUserInfo(data))
      // // orgs && commit("SET_ORGS", orgs);
      // resolve()
      if (loginType === 'sms') {
        // 短信登陆
      } else if (loginType === 'zzd-qrcode') {
        // 浙政钉扫码
      } else {
        // 账号密码登陆
        const user = encryption({
          data: {
            username,
            password,
            code,
            redomStr
          },
          key: 'thanks,pig4cloud',
          param: ['password']
        })

        login(user.username, user.password, user.code, user.redomStr).then(response => {
          const data = response

          commit('SET_TOKEN', data.access_token)
          setToken(data.access_token)
          resolve(true)
        }).catch(error => {
          reject(error)
        })
      }
    })
  },
  // get user info
  getInfo({ commit, state, dispatch }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async(resolve, reject) => {
      getInfo().then((res) => {
        const data = res.data || {}
        if (!data) {
          removeToken()
          location.reload()
        }
        commit('SET_USERINFO', data.sysUser)
        commit('SET_DEPTS', data.sysDeptList)
        commit('SET_ROLES', data.roles || [])
        commit('SET_PERMISSIONS', data.permissions || [])
        resolve(data)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}

const getters = {
  token: state => state.token,
  roles: state => state.roles,
  userInfo: state => state.userInfo,
  depts: state => state.depts,
  orgs: state => state.orgs,
  permissions: state => state.permissions
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

