<template>
  <div class="cesium-panel">
    <div id="cesium-container" />

    <!-- 台风信息弹窗 -->
    <typhoonInfoDialog />
    <!-- 窗体信息 -->
    <windowInfo />
    <!-- 实例快捷工具 -->
    <exampleBox />
  </div>
</template>

<script>
import { defineComponent, nextTick, onMounted } from 'vue'
import { useStore } from 'vuex'

import { initCesium } from './js/initCesium'
import typhoonInfoDialog from './js/example/initTyphoon/typhoonInfoDialog.vue'
import windowInfo from './js/example/windowInfo/index.vue'
import exampleBox from './components/exampleBox/index.vue'
export default defineComponent({
  name: 'Cesium',
  components: {
    typhoonInfoDialog, windowInfo, exampleBox
  },
  setup() {
    const store = useStore()
    onMounted(() => {
      initCesium()
    })

    return {

    }
  }
})
</script>

<style lang='scss' scoped>
.cesium-panel{
  position: relative;
  height:100%;
}
#cesium-container {
  width: 100%;
  height: 100%;
}

</style>
