import request from '@/utils/request'
import store from '@/store'

export function add(data) {
  return request({
    url: '/admin/custom/group/add',
    method: 'post',
    data: data
  })
}
export function update(data) {
  return request({
    url: '/admin/custom/group/update',
    method: 'put',
    data: data
  })
}

export function del(id) {
  return request({
    url: '/admin/custom/group/delete/' + id,
    method: 'delete'
  })
}

export function change(data) {
  return request({
    url: '/admin/custom/group/change',
    method: 'post',
    data: data
  })
}

export function fetchList(query) {
  return request({
    url: '/admin/user/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: obj
  })
}

// 修改 用户状态（启用、禁用）
export function updateUserStatus(data) {
  return request({
    url: '/admin/user/updateUserStatus',
    method: 'put',
    data: data
  })
}

// 获取到用户部门树
export function getUserTree(data) {
  return request({
    url: '/admin/user/getDeptUsers',
    method: 'post',
    data: data
  })
}

// 获取到用户部门树
export function getSelectData(data) {
  return request({
    url: '/admin/user/getSelectData',
    method: 'post',
    data: data
  })
}

// 筛选自定义用户组内部人员数据
export function filterTreeData(params) {
  return request.post('/uniteurl001/system/filter', params)
}

// 初始化选人组件的数据
export const initSystem = async function(handler) {
  // store.component.actions.initTargetSelectData()
  // await Promise.all([
  //   store.dispatch('router/getModulesTree'),
  //   store.dispatch('dict/setDicts')
  // ])

  if (handler) { handler() }
}
