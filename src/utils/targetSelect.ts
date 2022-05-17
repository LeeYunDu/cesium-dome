import store from '@/store'

/**
 * 获取选人组件数据
 * @param selectType 获取数据类型 user/dept/custom
 * @returns
 */
export async function getTargetSelectData(selectType:Array<string>) {
  return store.dispatch('component/getTargetSelectData', selectType)
}

export async function filterNode(params) {
  return store.dispatch('component/filterNode', params)
}
