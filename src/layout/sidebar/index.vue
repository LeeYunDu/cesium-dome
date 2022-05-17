<template>
  <div class="sidebar-container">
    <logo />

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- :collapse="isCollapse" -->
      <el-menu
        :default-active="$route.path"

        :background="variables['menuBg']"
        :text-color="variables['menuText']"
        :active-text-color="variables[skin + 'menuActiveText']"
        mode="vertical"
        :unique-opened="true"
      >
        <SidebarItem
          v-for="route in router"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script lang='ts'>
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import SidebarItem from './components/SidebarItem.vue'
import logo from './components/logo.vue'
import variables from '@/styles/variable.scss'

export default defineComponent({
  components: {
    SidebarItem, logo
  },
  setup() {
    const store = useStore()
    const router = computed(() => {
      return store.getters.router
    })

    return {
      router, variables
    }
  }
})
</script>
<style lang="scss" scoped>
.sidebar-container {
  background: #0063f7 url('~@/assets/layout/sliderbar-bg.png') no-repeat center bottom !important;
  width: $sideBarWidth !important;
  background-position: center bottom;
  background-repeat: no-repeat;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  box-shadow: $sidebarShadow;
}
</style>
