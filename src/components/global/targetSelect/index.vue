<template>
  <el-dialog
    v-model="visible"
    width="50%"
    append-to-body
    :before-close="close"
    custom-class="target-select"
    v-bind="$attrs"
    :destroy-on-close="true"
    @open="open"
  >
    <div class="target-select-main">
      <tabsBar
        v-model="currentTab"
        :tabs="tabsData"
        @change-tab="handleTab"
      />
      <div class="target-select-panel">
        <div class="target-select-panel-left">
          <treeBox
            ref="tree"
            :current-type="currentType"
            v-bind="$attrs"
            :data="treeData"
            :props="props"
            :default-expand-all="false"
            @cance-all="canceAll"
            @select-all="selectAll"
            @check-tree="checkTree"
            @set-check-result="setCheckResult"
          />
        </div>
        <div class="target-select-panel-right">

          <selectedBox
            ref="selected-box"
            :types="types"
            :props="finalProps"
            :limit="limit"
            @clearAllSelected="clearAllSelected"
            @change-selected="setTreeChecked"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          确 定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-button v-if="selectType==='button'" type="primary" size="mini" @click="visible=true"> 选择人员</el-button>
  <selectedInput
    v-if="selectType==='input'"
    v-model:value="visible"
    v-bind="$attrs"
    :checked-result="checkedResult"
    :labels="labels"
    :props="finalProps"
    :input-name="inputName"
    @tagClose="tagClose"
  />
</template>
<script >

import { computed, defineComponent, nextTick, onMounted, reactive, toRefs, watch } from 'vue'
import tabsBar from './component/tabsBar.vue'
import treeBox from './component/treeBox.vue'

import { defaultProps } from './config'
import selectedBox from './component/selected-box/index.vue'
import selectedInput from './component/selected-input/index.vue'
export default defineComponent({
  name: 'TargetSelect',
  components: {
    tabsBar, treeBox, selectedBox, selectedInput
  },
  props: {
    inputName: {
      type: String,
      default: '选择人员'
    },
    // 选中的对象
    checked: {
      type: [Array, Object],
      default: null
    },
    // 选中的对象id集合,以英文逗号,隔开
    ids: {
      type: [Array, Object],
      default: null
    },
    // 选中的对象label集合,以英文逗号,隔开
    labels: {
      type: [Array, Object],
      default: null
    },
    // 选人组件的数据
    data: {
      type: Array,
      default: () => []
    },

    props: { // 配置选项
      type: Object,
      default: () => defaultProps
    },

    types: { // 数据分类依据
      type: Object,
      default: null
    },

    isRadio: { // 启用单选模式
      type: Boolean,
      default: false
    },

    defaultSelect: { // 默认选中数据
      type: [Array, Object],
      default: null
    },

    clickSelectedChild: {
      type: Boolean,
      default: false
    },

    limit: { // 人员选择数量限制
      type: Number,
      default: 0
    },
    selectType: {
      type: String,
      default: 'input' // button 、 input
    }
  },
  emits: ['close', 'submit', 'update:checked', 'update:ids', 'update:labels'],
  setup(props, ctx) {
    const that = reactive({
      loading: false,
      visible: false,
      selection: false,
      currentTab: '', // 当前选中的tab
      isCustotruemGroup: false, // 当前选中标签是否为自定义组
      treeData: [], // 树数据
      defaultExpandedKeys: [],
      checkedResult: []// 选择的数据结果
    })

    const refs = reactive({
      'selected-box': null,
      'tree': null
    })
    // 标签数据
    const tabsData = computed(() => {
      return props.data.map(item => {
        // 组合标签数据结构
        const tab = {
          label: item[finalProps.value.label],
          id: item[finalProps.value.id]
        }

        return tab
      })
    })

    const close = () => {
      refs['tree'].clear()
      that.visible = false
      ctx.emit('close')
    }

    // 将用户定义的props覆盖在默认props上得到最终props
    const finalProps = computed(() => {
      return {
        ...defaultProps,
        ...props.props
      }
    })
    // 树节点执行全选
    const selectAll = (area) => {
      // 右侧批量新增，并返回已勾选id数组
      const idArr = refs['selected-box'].bulkAdd(area)
      setTreeChecked(idArr)
    }
    // 树节点执行取消全选
    const canceAll = (area) => {
      const idArr = refs['selected-box'].bulkDel(area)
      setTreeChecked(idArr)
    }
    // 设置树勾选内容
    const setTreeChecked = (arr) => {
      refs.tree.setCheckedKeys(arr)
    }
    const currentType = () => {
      const target = props.data.find(item => item.id === that.currentTab)
      if (target) {
        if (Reflect.has(target, 'type')) {
          return target.type
        } else if (target.customize) {
          return 'custom'
        } else if (target.myCustomize) {
          return 'myCustomize'
        } else if (target.id === 'candidate') {
          return 'isCandidate'
        } else {
          return ''
        }
      }
      return ''
    }
    /**
     * 清空树节点选中内容，以及selectBox内容
     */
    const clearAllSelected = () => {
      if (!props.selection) {
        setTreeChecked([])
      } else {
        refs.tree.$clearAll()
      }
      clearSelected()
    }
    // 清空已选择内容
    const clearSelected = () => {
      refs['selected-box'].clearSelected()
    }
    // 切换标签
    const handleTab = (currentTab) => {
      refs.tree.clear()
      updateTree()
    }
    // 更新树节点
    const updateTree = () => {
      setTreeData()

      nextTick(() => {
        setTreeChecked(refs['selected-box'].getFlatSelected().map(item => item[finalProps.value.id]))
      })
    }
    // 设置树数据
    const setTreeData = (value) => {
      const target = props.data.find(item => item[finalProps.value.id] === that.currentTab)

      if (target && Reflect.has(target, finalProps.value.children)) {
        that.treeData = target[finalProps.value.children]
      } else {
        that.treeData = []
      }
    }
    /**
     * 树节点勾选 or 取消
     * flag表示单选模式下取消了选择
     */
    const checkTree = (checked, checkedList, flag) => {
      if (props.isRadio) { // 单选模式
        clearSelected()

        if (!flag) {
          return
        }
      }
      nextTick(() => {
        if (props.clickSelectedChild) {
          refs['selected-box'].setSelected(checked)
          checked.children && checked.children.forEach(item => {
            refs['selected-box'].setSelected(item)
            if (item.children) {
              item.children.forEach(item => {
                refs['selected-box'].setSelected(item)
              })
            }
          })
        } else {
          checked = { ...checked, idType: currentType }
          refs['selected-box'].setSelected(checked)
        }
      })
    }
    // 点击确认
    const onSubmit = () => {
      var data = refs['selected-box'].getSelected()
      that.checkedResult = data
      ctx.emit('submit', data)
      close()
    }
    // 打开窗口 初始化
    const open = async() => {
      that.loading = false
      that.defaultExpandedKeys = []
      that.currentTab = tabsData.value[0].id // tabs数据已经格式化过，直接读id

      // 初始化树形结构数据
      setTreeData()

      if (tabsData.value.length === 1 && that.currentTab === 'candidate') {
        setExpandKey(that.treeData, 2)
      }
      // 初始化数据有个时间差 等待dom更新
      nextTick(() => {
        initTreeChecked()
        refs.tree.filterNode('')
      })
    }

    // 默认展开树形结构
    const setExpandKey = (children, num) => {
      if (num > 0) {
        children.forEach(item => {
          if (item.children && item.children.length > 0) {
            that.defaultExpandedKeys.push(item.id)
            setExpandKey(item.children, num - 1)
          }
        })
      }
    }
    // 初始化树选中
    const initTreeChecked = () => {
      const result = props.defaultSelect

      const checkedIds = props.ids.split(',')

      // if (that.checkedResult.length > 0) {
      //   result = that.checkedResult
      //   const ids = []
      //   result.forEach(e => {
      //     ids.push(e.id)
      //   })
      //   checkedIds = ids
      // }
      try {
        refs.tree.setDefaultCheck(checkedIds)
        // refs['selected-box'].setDefaultCheck(that.checkedResult)
      } catch (error) {

      }
    }
    // 标签页关闭根据下标删除数据
    const tagClose = (index) => {
      that.checkedResult.splice(index, 1)
    }

    watch(() => that.checkedResult, (val) => {
      const result = val

      if (Array.isArray(val)) {
        const ids = []
        const labels = []
        result.forEach(e => {
          ids.push(e.id)
          labels.push(e.name)
        })
        const emitObject = {
          checkeds: result,
          ids: ids.join(','),
          labels: labels.join(',')
        }

        ctx.emit('update:checked', result) // 整体勾选的人员对象数组
        ctx.emit('update:ids', emitObject.ids) // 整体勾选的人员id,是字符串,并以,隔开
        ctx.emit('update:labels', emitObject.labels) // 整体勾选的人员name,是字符串,并以,隔开
      }
    }, { deep: true })

    // 赋值选中的节点数据
    const setCheckResult = (val) => {
      that.checkedResult = val
    }

    // 初始化 拼接 checkedResult 数据
    const init = () => {
      // 前提 双向绑定 labels数据 和 ids 数据
      if (props.labels && props.ids) {
        const labels = props.labels.split(',')
        const ids = props.ids.split(',')
        const arr = []
        labels.forEach((element, index) => {
          const obj = {}
          obj[props.props.id] = ids[index]
          obj[props.props.label] = labels[index]
          arr.push(obj)
        })
        that.checkedResult = arr
      }
    }
    init()
    return {
      ...toRefs(that), ...toRefs(refs),
      checkTree, onSubmit, open, initTreeChecked, handleTab,
      close, tabsData, currentType, selectAll, canceAll, finalProps, clearAllSelected, setTreeChecked, tagClose, setCheckResult
    }
  }
})
</script>
<style lang="scss" scped>
.target-select-main {
  display: flex;
  .target-select-panel {
    display: flex;
    flex: 1;
    .target-select-panel-left,
    .target-select-panel-right {
      height: 500px;
    }
    .target-select-panel-left {
      flex: 1;
    }
    .target-select-panel-right {
      width: 35%;
      border: 1px solid #e4e7ed;
    }
  }
}
</style>
