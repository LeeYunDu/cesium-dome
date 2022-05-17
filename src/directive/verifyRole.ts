
/**
 * 2021-10-20
 * 李云都
 * 关于按钮权限的身份证验证指令
 */
import type { DirectiveBinding, VNode, ObjectDirective } from 'vue'
import store from '@/store'
const attachEvents = (
  el: HTMLElement,
  binding: DirectiveBinding,
  vnode: VNode
) => {
  const value = binding.value

  const permissions = store.getters.permissions

  if (!(value in permissions)) {
    // 没有权限隐藏按钮
    el.style.display = 'none'
  }
}

export default {
  mounted(el, binding, vnode) {
    attachEvents(el, binding, vnode)
  },
  updated(el, binding, vnode) {
    attachEvents(el, binding, vnode)
  }
} as ObjectDirective

