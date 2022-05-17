<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{'submenu-title-noDropdown':!isNest}"
          style="white-space: pre-wrap; line-height: 24px!important;padding: 13px 0px; height: auto!important"
        >
          <!-- <item
            v-if="onlyOneChild.meta"
            :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
            :title="onlyOneChild.meta.title"
          /> -->
          {{ onlyOneChild.meta.title }}
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)">
      <template #title>
        <!-- <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" /> -->
        <span>{{ item.meta.title }}</span>
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.code"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>

  </div>
</template>
<script lang='ts'>
import { defineComponent, PropType, ref } from 'vue'
import AppLink from './Link.vue'

import { RouteRecordRaw, useRouter } from 'vue-router'
import SidebarItem from './SidebarItem.vue'
import path from 'path'
import { isExternal } from '@/utils/regular'

export default defineComponent({
  components: {
    SidebarItem, AppLink
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const router = useRouter()
    const navTo = (path) => {
      router.push({ path: `${props.basePath}/${path}` })
    }
    const onlyOneChild = ref({})
    const hasOneShowingChild = (children = [], parent) => {
      const showingChildren = children.filter(item => {
        if ((item as any).hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          onlyOneChild.value = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        onlyOneChild.value = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    }

    const resolvePath = (routePath) => {
      if (isExternal(routePath)) {
        return `/${routePath}`
      }
      // if (routePath === 'dashboard') {
      //   return '/'
      // }
      // return `${props.basePath}/${routePath}`
      return path.resolve(props.basePath, routePath)
    }

    return {
      navTo, hasOneShowingChild, onlyOneChild, resolvePath
    }
  }
})
</script>
<style lang="scss">
.menu-item-box {
  display: flex;
  align-items: center;
}
.el-scrollbar__view > .el-menu > .menu-wrapper {

  .el-submenu .el-submenu__title {
    min-width: 153px;
  }

  &:first-child {
    .el-menu-item {
      // font-size: 18px;
      // font-weight: 600;

      .svg-icon {
        display: none;
      }
    }
  }
}
</style>
