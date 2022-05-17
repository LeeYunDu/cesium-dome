
// eslint-disable-next-line
import { del as delCustomize, add as addCustomize, change as changeCustomizeData, filterTreeData ,getSelectData} from '@/api/sosSelectUser'
import Cookies from 'js-cookie'

const inFifteenMinutes = new Date(new Date().getTime() + 30 * 60 * 1000)
// 选择器组件后台支持的所有分类
const targetSelectAllkeys = {
  dept: '部门',
  dept_all: '全部门',
  dept_disabled: '部门',
  role: '角色',
  userGroup: '用户组',
  user: '用户',
  userByRole: '角色-用户',
  userByGroup: '用户组-用户',
  userByMy: '本部门',
  dept_for_user: '部门文书'
}

const state = {
  // 组件: 整合选择弹窗组件
  selectDialogUnion: {
    deptTree: [],
    roleTree: [],
    userGroupList: [],
    deptUserTree: []
  },
  selectRequestState: false,
  // 选择器组件缓存数据数据
  targetSelectData: Cookies.get('target-select-data') ? JSON.parse(Cookies.get('target-select-data')) : undefined,

  // 选择器组件缓存数据数据 自定义分组
  targetSelectCustom: Cookies.get('target-select-custom') ? JSON.parse(Cookies.get('target-select-custom')) : undefined
}

const mutations = {
  SET_TARGET_SELECT_DATA: (state, info) => {
    state.targetSelectData = info
    // Cookies.set('target-select-data', JSON.stringify(state.targetSelectData), { expires: inFifteenMinutes, SameSite: 'None', Secure: 'Secure' })
    Cookies.set('target-select-data', JSON.stringify(state.targetSelectData), { expires: inFifteenMinutes })
  },

  SET_TARGET_SELECT_CUSTOM: (state, info) => {
    state.targetSelectCustom = info
    // Cookies.set('target-select-custom', JSON.stringify(state.targetSelectCustom), { expires: inFifteenMinutes, SameSite: 'None', Secure: 'Secure' })
    Cookies.set('target-select-custom', JSON.stringify(state.targetSelectCustom), { expires: inFifteenMinutes })
  },

  REMOVE_TARGET_SELECT_DATA: (state) => {
    state.targetSelectData = undefined
    Cookies.remove('target-select-data')
    state.targetSelectCustom = undefined
    Cookies.remove('target-select-custom')
  },

  SET_SELECTDIALOGUNION_DEPTTREE: (state, info) => {
    state.selectDialogUnion.deptTree = info
  },
  SET_SELECTDIALOGUNION_ROLETREE: (state, info) => {
    state.selectDialogUnion.roleTree = info
  },
  SET_SELECTDIALOGUNION_USERGROUPLIST: (state, info) => {
    state.selectDialogUnion.userGroupList = info
  },
  SET_SELECTDIALOGUNION_DEPTUSERTREE: (state, info) => {
    state.selectDialogUnion.deptUserTree = info
  },
  SET_SELECTDIALOGUNION_RELOAD: (state, type) => {
    state.selectDialogUnion[type] = null
  },
  SET_REQUESTSTATE: (state, type) => {
    state.selectRequestState = type
  }
}

const actions = {
  sendRequest({ state, commit }, isCustomUpdate) {
    return new Promise(async(resolve, reject) => {
      const types = Object.keys(targetSelectAllkeys).join(',') + ',custom'

      const response = await getSelectData({ types })

      const ret = response
      if (response.code === 0) {
        const data:Array<any> = []
        const res = ret.data
        let custom = []
        for (const key in res) {
          if (key === 'custom') {
            custom = res[key]
          }
          const tab:any = {
            name: targetSelectAllkeys[key],
            id: key,
            type: key,
            children: []
          }
          if (Array.isArray(res[key])) {
            res[key].forEach(item => {
              tab.children.push({ ...item })
            })
          }

          data.push(tab)
        }
        custom.forEach((item:any) => {
          item.customize = true
        })
        commit('SET_TARGET_SELECT_DATA', data)
        commit('SET_TARGET_SELECT_CUSTOM', custom)
        resolve(true)
      } else {
        reject(false)
      }
      commit('SET_REQUESTSTATE', false)
    })
  },
  // 获取选择器组件所有数据
  initTargetSelectData({ commit, dispatch }, isCustomUpdate) {
    // 正在请求
    // 一次过请求 状态设置为true后续请求处于等待状态
    return new Promise(async(resolve, reject) => {
      if (!state.selectRequestState) {
        commit('SET_REQUESTSTATE', true)
        await dispatch('sendRequest', isCustomUpdate)
        resolve(true)
      }
    })
  },

  removeTargetSelectData({ commit }) {
    commit('REMOVE_TARGET_SELECT_DATA')
  },

  /**
   * 获取选人组件数据
   * @param {*} params String or Array
   */
  getTargetSelectData({ dispatch }, params) {
    return new Promise(async(resolve, reject) => {
      let res = null

      if (Array.isArray(params)) {
        res = await dispatch('getTargetSelectUnite', params)
      } else if (typeof params === 'string') {
        res = await dispatch('getTargetSelectSingle', params)
      } else {
        reject('getTargetSelectData 参数错误')
      }

      resolve(res)
    })
  },

  /**
   * 获取选人组件数据(单一类型的)
   * @param {*} params :
   *  label: 标签展示的名称
   *  key: 请求的key值
   */
  getTargetSelectSingle({ state, dispatch }, key) {
    return new Promise(async(resolve, reject) => {
      if (!state.targetSelectData || !state.targetSelectCustom) {
        await dispatch('initTargetSelectData')
          .catch(e => {
            reject()
          })
      }
      if (key === 'custom') {
        resolve(state.targetSelectCustom)
      }
      const target = state.targetSelectData.find(item => item.id === key)
      if (target) {
        resolve([target])
      } else {
        reject('未知的分类')
      }
    })
  },

  /**
   * 获取选人组件数据(多类型的)
   * @param {*} keys 请求
   */
  getTargetSelectUnite({ state, dispatch }, arrays) {
    const keys = [
      ...arrays
    ]
    return new Promise(async(resolve, reject) => {
      if (keys.length <= 0) {
        reject('keys配置无效')
      }
      // 删除custom项
      const index = keys.findIndex(item => item === 'custom')
      if (index !== -1) {
        keys.splice(index, 1)
      }

      // 检测数据是否过期
      if (!state.targetSelectData || !state.targetSelectCustom) {
        await dispatch('initTargetSelectData')
          .catch(e => {
            reject()
          })
      }

      let data:Array<any> = []
      keys.forEach(key => {
        const target = state.targetSelectData.find(item => item.id === key)
        if (target) {
          data.push(target)
        }
      })
      if (index !== -1) {
        data = data.concat(state.targetSelectCustom)
      }

      resolve(data)
    })
  },

  // 新建自定义分组
  createCusetom({ state, dispatch }, name) {
    return new Promise(async(resolve, reject) => {
      const res = await addCustomize({ name })
      if (res.data.code === 0) {
        dispatch('initTargetSelectData')

        resolve(res.data.data.id)
      }
      reject('创建失败')
    })
  },

  // 更新自定义分组
  updateCusetom({ dispatch }, params) {
    return new Promise(async(resolve, reject) => {
      const res = await changeCustomizeData({ groupId: params.id, sysCustomGroupRelationList: params.data })
      if (res.data.code === 0) {
        dispatch('initTargetSelectData', true)
        resolve(true)
      }
      reject('更新失败')
    })
  },

  deleteCustom({ dispatch }, id) {
    return new Promise(async(resolve, reject) => {
      const res = await delCustomize(id)
      if (res.data.code === 0) {
        dispatch('initTargetSelectData', true)
        resolve(true)
      }
      reject('删除失败')
    })
  },

  filterNode({ dispatch }, params) {
    return new Promise(async(resolve, reject) => {
      const response = await filterTreeData({
        name: params.value,
        type: params.type,
        id: params.id
      })
      if (response.success) {
        resolve(response.data)
      }
      reject('失败')
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
