<template>
  <div class="cesium-toolip-container">
    <div id="typhoon-popup">
      <div class="typhoon-close-button">×</div>
      <div class="typhoon-title" style="color:#008cc6"><b>台风名称:</b>{{ typhoonPointInfo.nno }}{{ typhoonPointInfo.name }}</div>
      <div class="typhoon-info"><b>具体时间:</b>{{ typhoonPointInfo.time }}</div>
      <div class="typhoon-info"><b>中心位置:</b>{{ typhoonPointInfo.longitude }}°E|{{ typhoonPointInfo.latitude }}°N</div>
      <div class="typhoon-info"><b>最大风速:</b>{{ typhoonPointInfo.speed }}m/s</div>
      <div class="typhoon-info"><b>气旋强压:</b>{{ typhoonPointInfo.power }}级{{ typhoonPointInfo.strong }}</div>
      <div class="typhoon-info"><b>中心气压:</b>{{ typhoonPointInfo.pressure }}hPa</div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const that = reactive({
      dialogVisible: false
    })
    const store = useStore()
    const handleClose = () => {

    }
    const typhoonPointInfo = computed(() => {
      return store.getters.typhoonPointInfo
    })
    return {
      ...toRefs(that), handleClose, typhoonPointInfo
    }
  }
})
</script>

<style lang='scss' scoped>
.cesium-toolip-container{
  position: absolute;
  top: 0;
  left: 0;
}
#typhoon-popup{
  padding: 5px;
  display: none;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.75);
  font-size: 12px;
  min-width: 200px;
  position: relative;
  padding-top: 15px;
  box-sizing: border-box;
  .typhoon-close-button{
    position: absolute;
    right: 5px;
    top: 0;
    font-size: 18px;
    cursor: pointer;
  }
}
</style>
