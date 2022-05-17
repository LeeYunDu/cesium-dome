<template>
  <div class="normal-box">
    <div class="chooseNumber"><span>选中数量:</span>{{ selected.length }}
      <div class="clear">
        <el-button type="danger" size="mini" @click="clearAllSelected">清空</el-button>
      </div>
    </div>
    <div class="tag-container">
      <el-scrollbar style="height: 100%">
        <div>
          <el-tag
            v-for="tag in selected"
            :key="tag[props.id]"
            style="margin: 0 5px 5px 0;"
            closable
            @close="closeTag(tag)"
          >
            {{ tag[props.label] }}
          </el-tag>
        </div>
      </el-scrollbar>
    </div>

  </div>
</template>
<script lang='ts'>
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  props: {
    props: {
      type: Object,
      required: true
    },
    limit: {
      type: Number,
      default: 0
    }
  },
  emits: ['clearAllSelected', 'change-selected', 'change-selected'],
  setup(props, ctx) {
    const that = reactive({
      selected: []
    })
    const clearAllSelected = () => {
      ctx.emit('clearAllSelected')
    }

    // 关闭标签
    const closeTag = (tag, key) => {
      const index = that.selected.findIndex(item => item[props.props.id] === tag[props.props.id])
      if (index !== -1) {
        that.selected.splice(index, 1)
      }

      ctx.emit('change-selected', that.selected.map(item => {
        return item[props.props.id]
      }))
    }
    /**
     * 数组快速去重
     * @param {Array} arr 原始数组
     * @param {String} key 用于判断两个元素是否相同
     * @returns {Array} 返回去重后的数组
     */

    function doDeduplication(arr, key = 'id') {
      const output:string[] = [] // 去重后输出的数组
      const obj = {} // 去重处理对象

      // 使用对象key值不重复的特性做去重处理
      for (const i of arr) {
        if (!obj[i[key]]) {
          output.push(i)
          obj[i[key]] = 1
        }
      }

      return output
    }

    // 批量新增
    const bulkAdd = (area) => {
      const originArr = [...that.selected, ...area]
      var selected:Array<any> = doDeduplication(originArr, props.props.id) // 去重后的已选择数组
      if (props.limit !== 0 && selected.length > props.limit) {
        ElMessage({
          type: 'error',
          message: '选择不能超过' + props.limit + '个'
        })
        selected = selected.slice(0, props.limit)
      }
      // 修改 全选操作
      const selectedArr:any = []
      const idArr:number[] = []
      selected.forEach(item => {
        if (!item.disabled) {
          selectedArr.push(item)
          idArr.push(item.id)
        }
      })
      // 输出的id数组
      // this.$set(this, 'selected', selectedArr)
      that.selected = selectedArr
      return idArr
    }
    const bulkDel = (area) => {
      const originArr = [...that.selected]
      var selected:Array<any> = doDeduplication(originArr, props.props.id) // 去重后的已选择数组
      that.selected = selected.filter(li => !area.some(cli => cli.id === li.id)) as any
      return that.selected.map((li: any) => li.id)
    }

    // 清空已选择内容
    const clearSelected = () => {
      that.selected = []
    }

    // 设置勾选内容到面板
    function setSelected(checked) {
      const i = that.selected.findIndex(item => item[props.props.id] === checked[props.props.id])

      if (i === -1) {
        if (props.limit !== 0 && that.selected.length >= props.limit) {
          ctx.emit('change-selected', that.selected.map(item => {
            return item[props.props.id]
          }))
          return ElMessage({
            type: 'error',
            message: '选择不能超过' + props.limit + '个'
          })
        }

        (that.selected as Array<any>).push(checked)
      } else {
        (that.selected as Array<any>).splice(i, 1)
      }
    }

    // 返回当前选择对象
    function getSelected() {
      return that.selected
    }

    // 返回当前选择对象
    function getFlatSelected() {
      return getSelected()
    }

    // 初始化树默认选择数量
    function setDefaultCheck(data) {
      const idKeyName = props.props.id

      if (Array.isArray(data)) {
        data.forEach(element => {
          setSelected(element)
        })
        // (refs.tree as any).setCheckedKeys(data.map(item => item[idKeyName]))
      } else {
        // 这里区分了 数据类型 可能有 user/dept/等等  才用了 for in 循环

        let allID:any = []
        for (const key in data) {
          allID = [...allID, ...data[key]]
        }
        allID.forEach(element => {
          setSelected(element)
        })
      }
    }
    return {
      ...toRefs(that),
      clearAllSelected, closeTag, bulkAdd, bulkDel, clearSelected, setSelected, getSelected,
      getFlatSelected, setDefaultCheck
    }
  }
})
</script>
<style lang="scss" scoped>
.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  overflow: auto;
  height: 88%;
  margin: 0 10px;
}
.normal-box {
  padding: 0;
  height: 100%;
  .chooseNumber {
    width: 100%;
    height: 42px;
    background: #f6f7fc;
    border: 1px solid #e4e7ed;
    margin-bottom: 10px;
    line-height: 42px;
    font-size: 14px;
    font-weight: bold;
    color: #2497f2;
    span {
      color: #303133;
      margin: 0 10px;
    }
    .clear {
      float: right;
      margin-right: 10px;
    }
  }
}
</style>
