<template>
  <div class="tabs-bar sos-tabs-bar">
    <el-tabs
      v-model="currentTab"
      v-bind="$attrs"
      :tab-position="tabPosition"
      type="card"
      @tab-click="handleTab"
      @tab-remove="removeCustom"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.id"
        :name="tab.id"
        :closable="tab.customize"
      >
        <template #label>
          <span>
            <i v-if="tab.customContent" :class="custonIcon" />
            {{ tab.label }}
            <el-button
              v-if="tab.customize && !isRadio"
              class="tab-btn"
              type="text"
              @click.stop="handleSelectAll(tab)"
            >
              全选
            </el-button>
          </span>
        </template>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang='ts'>
import { defineComponent, PropType, reactive, toRefs, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { tabItem } from '../types/index'
export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isRadio: {
      // 启用单选模式
      type: Boolean,
      default: false
    },
    tabs: {
      // tabs数据
      type: Array as PropType<Array<tabItem>>,
      default: () => []
    },
    // 自定义图标
    custonIcon: {
      type: String,
      default: 'el-icon-edit'
    }
  },
  emits: ['selectAll', 'changeTab', 'update:value'],
  setup(props, ctx) {
    const that = reactive({
      tabPosition: 'left', // tab摆放位置
      currentTab: ''// 当前选中的tab
    })

    // tab 被选中时触发
    const handleTab = () => {
      ctx.emit('update:value', that.currentTab)
      ctx.emit('changeTab', that.currentTab)
    }

    // 点击 tab 移除按钮后触发
    const removeCustom = () => {
      ElMessageBox.confirm('此操作将永久删除该自定组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除!'
          })
        })
    }

    // 全选
    const handleSelectAll = (tab) => {
      ctx.emit('selectAll', tab)
    }

    watch(() => props.value, (val) => { if (val) { that.currentTab = val as any } })

    return {
      ...toRefs(that),
      handleTab, removeCustom, handleSelectAll
    }
  }
})
</script>
<style lang="scss" scped>

</style>
