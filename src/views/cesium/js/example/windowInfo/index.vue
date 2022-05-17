<template>
  <div class="window-info-panel">
    <span>经纬度:{{ windowInfo.lng }},{{ windowInfo.lat }}</span>
    <span>高度{{ windowInfo.height }}</span>
    <span>方向:{{ windowInfo.heading }}</span>
    <span>角度:{{ windowInfo.pitch }}</span>
  </div>
</template>

<script>

import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    const windowInfo = computed(() => {
      return store.getters.windowInfo
    })
    return {
      windowInfo
    }
  }
})
</script>

<style lang='scss'>
.window-info-panel{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: black;
  color: white;
  font-size: 14px;
  span{
    margin-right: 10px;
  }
}
</style>
