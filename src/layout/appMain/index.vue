<template>
  <div class="app-main-container">
    <navBar />
    <breadcrumb />
    <div class="app-main">
      <div class="app-main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { defineComponent } from 'vue'
import navBar from './navBar.vue'
import breadcrumb from '@/components/Breadcrumb/index.vue'
export default defineComponent({
  components: { navBar, breadcrumb }
})
</script>
<style lang="scss" scoped>
.app-main-container {
  margin-left: $sideBarWidth;
  min-height: 100%;
  .app-main {
    position: relative;
    padding: 15px;
    padding-top: 0;
    padding-bottom: 15px;
    width: 100%;
    height: calc(100vh - 92px);
    overflow: auto;
    background-color: #f0f0f0;
    box-sizing: border-box;
    .app-main-content {
      padding: 20px;
      box-sizing: border-box;
      margin-top: 10px;
      height: calc(100% - 10px);
      border-radius: 5px;
      background: white;
    }
  }
}
</style>
