<template>
  <div class="app-wrapper">
    <sidebar />
    <appMain />
  </div>
</template>
<script lang='ts'>
import { defineComponent } from 'vue'
import sidebar from './sidebar/index.vue'
import appMain from './appMain/index.vue'
export default defineComponent({
  components: {
    sidebar, appMain
  }
})
</script>
<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
