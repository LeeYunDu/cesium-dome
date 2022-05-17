<template>
  <div id="pagination-box" class="pagination-box">
    <el-pagination
      background
      :layout="layout"
      :page-sizes="pageSizes"
      :current-page="currentPage"
      v-bind="$attrs"
    />
  </div>
</template>
<script>
import { computed, defineComponent, toRefs } from 'vue'

export default defineComponent({
  props: {
    pageSizes: {
      type: Array,
      default() {
        return []
      }
    },
    currentPage: {
      type: Number,
      default() {
        return 1
      }
    }
  },
  setup(props) {
    const { pageSizes } = toRefs(props)
    const layout = computed(() => `${pageSizes.value.length ? 'sizes, ' : ''}total, prev, pager, next, jumper`)
    return {
      layout
    }
  }
})
</script>
<style lang="scss" scoped>
.pagination-box {
  padding: 0;
  padding-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
