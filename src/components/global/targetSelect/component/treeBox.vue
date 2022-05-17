<template>
  <div class="tree-box sos-tree-box">
    <div class="header_search">
      <el-input
        v-model="filterText"
        placeholder="请输入搜索关键词..."
        style="width: 100%"
      >
        <template #append>
          <el-button icon="el-icon-search" />
        </template>
      </el-input>
    </div>
    <div v-loading="loading" class="tree-wrap">
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        :node-key="props.id"
        :check-strictly="!clickSelectedChild"
        :check-on-click-node="false"
        :default-expanded-keys="defaultExpanded"
        :default-checked-keys="defaultChecked"
        :filter-node-method="filterNode"
        :props="props"
        :render-content="renderContent"
        :default-expand-all="defaultExpandAll"
        @check="checkTreeNode"
      />
    </div>
  </div>
</template>
<script lang='ts'>
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
  watchEffect
} from 'vue'
import { ElButton } from 'element-plus'
export default defineComponent({
  props: {
    data: {
      // 树数据
      type: Array,
      default: () => []
    },

    defaultChecked: {
      // 默认勾选的节点
      type: Array,
      default: () => []
    },

    types: {
      // 数据分类依据
      type: Object,
      default: null
    },

    props: {
      type: Object,
      required: true
    },

    isRadio: {
      // 是否为单选
      type: Boolean,
      default: false
    },

    selectAllType: {
      // 全选模式 默认只选择下一级
      type: String,
      default: 'next'
    },

    isCustomGroup: {
      // 当前为自定义组
      type: Boolean,
      default: false
    },

    currentType: {
      // 当前分组类型
      type: String,
      default: ''
    },

    currentId: {
      // 当前分组ID
      type: String,
      default: ''
    },

    // eslint-disable-next-line
    filterNodeMethod: {
      // 树节点进行筛选时执行的方法
      required: true
    },
    // eslint-disable-next-line
    customizeFilterNodeMethod: {
      required: false,
      default: null
    },
    searchType: {
      type: String,
      default: 'change'
    },

    clickSelectedChild: {
      type: Boolean,
      default: false
    },
    // 自定义查询
    customQuery: {
      type: Boolean,
      default: false
    },
    filtrationGroup: {
      type: Array,
      default: () => []
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    defaultExpandedKeys: {
      type: Array,
      default: () => []
    },
    hasFilter: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'update-tree',
    'cance-all',
    'select-all',
    'check-tree',
    'set-check-result'
  ],
  setup(props: any, ctx) {
    const childrenKey = computed(() => props.props.children || 'children')
    const that = reactive<any>({
      Checked: [], // 被选中的节点
      treeData: [], // 可展示的树数据
      loading: false,
      isExpandAll: false,
      flag: true // dom强制刷新
    })

    const filterText = ref('')
    watch(filterText, (val) => {
      (refs.tree as any).filter(val)
    })

    const refs = reactive({
      tree: null
    })

    const filterNode = (value, data) => {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
    // 默认展开
    const defaultExpanded = computed(() => {
      if (props.defaultExpandedKeys.length > 0) {
        return props.defaultExpandedKeys
      }

      if (that.isExpandAll) {
        if (Array.isArray(that.treeData) && that.treeData.length > 0) {
          const flat = []
          flatObj(flat, that.treeData[0])
          return flat.map((item) => item[that.props.id])
        } else {
          return []
        }
      }
      if (that.treeData.length > 0) {
        // 普通分组 展开第一个
        return [that.treeData[0][props.props.id]]
      }
      return []
    })
    // 展开对象
    const flatObj = (target, obj) => {
      //
      if (Reflect.has(obj, childrenKey.value)) {
        // 该节点禁止勾选则忽略它本身
        target.push(obj)
        obj[childrenKey.value].forEach((item) => {
          flatObj(target, item)
        })
      } else {
        target.push(obj)
      }
    }
    // 树节点渲染
    const renderContent = (h, { node, data, store }) => {
      const temp: Array<HTMLDivElement> = []
      const label = h(
        'span',
        {
          onClick: () => {
            // nodeClick(node)
            // 树节点label的点击事件被弃用了
          }
        },
        node.label
      )
      const buttons: Array<HTMLDivElement> = []
      if (
        node.childNodes.length > 0 &&
        !(checkChildIsAllDisabled(node) || props.isRadio) && filterText.value.length === 0 && node.childNodes.some(li => !li.data.disabled)
      ) {
        const button = h(
          ElButton,
          {
            size: 'mini',
            type: 'text',
            onClick: (e) => {
              handleTreeNodeSelect({ node, data, store, e })
            }
          },
          checkIsSelectedAll(node) ? '取消' : '全选' // 取消全选有问题暂时隐藏
        )
        buttons.push(button)
      }

      temp.push(label)

      const rightSlot = h('span', buttons)
      temp.push(rightSlot)
      return h(
        'span',
        {
          class: 'custom-tree-node'
        },
        temp
      )
    }

    // 获取子节点（该子节点自身无子节点）
    const getChildNode = (obj, childKey) => {
      const arr: Array<any> = []
      obj[childKey].map((item) => {
        if (!item[props.props.disabled]) {
          arr.push(item)
        }
      })

      return arr
    }
    // 树节点选择点击
    const handleTreeNodeSelect = ({ node, data, store, e }) => {
      e.stopPropagation()
      if (checkIsSelectedAll(node)) {
        // 执行反选
        canceAll(data)
      } else {
        // 执行全选
        selectAll(data)
      }
    }
    // 全部反选
    const canceAll = (data) => {
      const area = getChildNode(data, childrenKey.value)
      ctx.emit('cance-all', area)
    }
    // 选择全部按钮
    const selectAll = (data) => {
      var area: any = null
      if (props.selectAllType === 'next') {
        area = getChildNode(data, childrenKey.value)
      } else if (props.selectAllType === 'all') {
        area = getAllChildNode([data])
      }
      ctx.emit('select-all', area)
    }
    const getAllChildNode = (tree) => {
      var temp: Array<any> = []
      const props_disabled = props.props.disabled
      var forFn = function(arr) {
        if (arr && arr.length > 0) {
          arr.forEach((arrItem) => {
            arrItem[childrenKey.value] &&
              arrItem[childrenKey.value].map((item) => {
                if (!item[props_disabled]) {
                  temp.push(item)
                }
                if (item[childrenKey.value]) {
                  forFn(item[childrenKey.value])
                }
              })
          })
        }
      }
      forFn(tree)
      return temp
    }

    // 判断是否全部被勾选
    const checkIsSelectedAll = (target) => {
      const flatArr = getChildNode(target, 'childNodes')
      let flag = true
      for (let i = 0; i < flatArr.length; i++) {
        if (!flatArr[i].checked) {
          flag = false
          break
        }
      }
      return flag
    }
    // 判断子节点是否全是被禁用
    const checkChildIsAllDisabled = (target) => {
      const flatArr = getChildNode(target, 'childNodes')
      let flag = true
      for (let i = 0; i < flatArr.length; i++) {
        if (!flatArr[i][props.props.disabled]) {
          flag = false
          break
        }
      }
      return flag
    }
    const setCheckedKeys = (arr) => {
      (refs.tree as any).setCheckedKeys(arr)
    }
    // 树节点选中
    const checkTreeNode = (checked, checkedList) => {
      // 单选模式 emitdidi三个参数表示单选取消了
      if (props.isRadio && checkedList.checkedKeys.length !== 0) {
        (refs.tree as any).setCheckedKeys([checked[props.props.id]])
        ctx.emit('check-tree', checked, checkedList, true)
      } else {
        ctx.emit('check-tree', checked, checkedList, false)
      }
    }
    // 处理树节点数据
    watchEffect(() => {
      const value = props.data
      if (!props.isCustomGroup || !props.types) {
        if (props.isCustomGroup) {
          const mapGroup = {
            dept: 'dept',
            dept_all: 'dept',
            dept_disabled: 'dept',
            role: 'role',
            userGroup: 'userGroup',
            user: 'user',
            userByRole: 'user',
            userByGroup: 'user',
            userByMy: 'user'
          }
          const filtrationSet = new Set(
            props.filtrationGroup.map((e) => mapGroup[e as any])
          );
          (value as Array<any>).forEach((e) => {
            e.disabled = !filtrationSet.has(mapGroup[e.type])
          })
        }
        that.treeData = value
      } else {
        const { label, id, children, type, disabled } = props.props
        that.treeData = [
          {
            [label]: '默认',
            [id]: 'default',
            [children]: [],
            [disabled]: true
          }
        ]
        // 根据types向treeData内初始化结构
        for (const key in props.types) {
          that.treeData.push({
            [label]: props.types[key],
            [id]: key,
            [children]: [],
            [disabled]: true
          })
        }
        // 数据分类填充
        value.forEach((element) => {
          const item: any = element
          // 判断该元素是否有type属性，存在用该值去搜索匹配treeData的id（无type属性则默认default）
          const searchID = Reflect.has(item, type) ? item[type] : 'default'
          // 找到目标
          const target: any = that.treeData.find((el) => el[id] === searchID)
          if (target) {
            target[children].push(item) // 目标子元素插入该项
          }
        })
      }
    })
    // 清空搜索框内容
    function clear() {
      that.filterText = ''
      that.loading = false
      that.isExpandAll = false
    }
    // 初始化树选中
    async function setDefaultCheck(data) {
      // const idKeyName = props.props.id

      // if (Array.isArray(data)) {
      //   (refs.tree as any).setCheckedKeys(data.map(item => item[idKeyName]))
      // } else {
      //   let allID:any = []
      //
      //   for (const key in data) {
      //     allID = [...allID, ...data[key]]
      //   }

      //   (refs.tree as any).setCheckedKeys(allID.map(item => {
      //     return item[idKeyName]
      //   }))
      // }
      // 这里传的data数据为 id 数组
      (refs.tree as any).setCheckedKeys(
        data.map((item) => {
          return item
        })
      )
      await nextTick()
      // 树形结构渲染后再抛出一个选中的结果
      const result = (refs.tree as any).getCheckedNodes()
      result.forEach((element) => {
        ctx.emit('check-tree', element, [], true)
      })

      ctx.emit('set-check-result', result)
    }

    // 获取当前选中的节点
    const getCheckedNodes = () => {
      const result = (refs.tree as any).getCheckedNodes()

      return result
    }

    return {
      ...toRefs(that),
      ...toRefs(refs),
      filterText,
      defaultExpanded,
      filterNode,
      renderContent,
      setCheckedKeys,
      checkTreeNode,
      clear,
      setDefaultCheck,
      getCheckedNodes
    }
  }
})
</script>
<style lang="scss" scoped>
.header_search {
  margin: 5px 0 12px 0;
  span {
    width: 15%;
    height: 30px;
    background: #40bfff;
    border-radius: 4px;
    color: #ffffff;
    display: inline-block;
    font-size: 14px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.sos-tree-box {
  .tree-wrap {
    border: 1px solid #e4e7ed !important;
    border-radius: 4px;
  }
  .el-input {
    width: 84%;
  }
  .custom-tree-node {
    color: #333333;
  }
}
.tree-box {
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: auto;
  height: calc(100% - 20px);
  border: 1px solid #e4e7ed;
  // border-left: 0;
  border-right: 0;
  border-radius: 0 0 0 4px;

  .tree-wrap {
    flex: 1;
    overflow: auto;
    border: none;
    padding: 0;

    // .el-tree-node>.el-tree-node__children {
    //   // overflow: auto;
    //   overflow-x: auto;
    // }
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
