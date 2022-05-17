<template>
  <div style="height: 100%">
    <section class="selected-box">

      <normal-box
        ref="selected-box"
        v-bind="$attrs"
      />
    </section>
  </div>
</template>
<script lang='ts'>
import { defineComponent, reactive, toRefs } from 'vue'
import NormalBox from './NormalBox.vue'
export default defineComponent({
  components: {
    NormalBox
  },
  setup() {
    const refs = reactive({
      'selected-box': null
    })
    const bulkAdd = (area) => {
      return (refs['selected-box'] as any).bulkAdd(area)
    }
    const bulkDel = (area) => {
      return (refs['selected-box'] as any).bulkDel(area)
    }
    const clearSelected = () => {
      (refs['selected-box'] as any).clearSelected()
    }
    function setSelected(checked) {
      (refs['selected-box'] as any).setSelected(checked)
    }
    function getSelected() {
      return (refs['selected-box'] as any).getSelected()
    }
    function getFlatSelected() {
      return (refs['selected-box'] as any).getFlatSelected()
    }
    function setDefaultCheck(data) {
      return (refs['selected-box'] as any).setDefaultCheck(data)
    }
    return {
      ...toRefs(refs),
      bulkAdd, bulkDel, clearSelected, setSelected, getSelected, getFlatSelected, setDefaultCheck
    }
  }
})
</script>
<style lang="scss" scoped>
.selected-box {
  height: 100%;
}
</style>
