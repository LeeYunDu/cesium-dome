<template>
  <div class="selected-tag-container">
    <div class="tag-list">
      <el-tag
        v-for="tag in checkedResult"
        :key="tag.name"
        closable
        :type="tag.type"
        size="mini"
        class="tag-item"
        @close="tagClose(tag)"
      >
        {{ tag.name }}
      </el-tag>
    </div>
    <div class="button-box">
      <el-button type="primary" size="mini" @click="handleShowDialog"> {{ inputName }}</el-button>
    </div>
  </div>
</template>
<script lang='ts'>
import { computed, defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false
    },
    checkedResult: {
      type: Array,
      default: () => []
    },
    inputName: {
      type: String,
      default: '选择人员'
    },
    props: {
      type: Object,
      required: true
    },
    labels: {
      type: String,
      default: ''
    },
    ids: {
      type: String,
      default: ''
    }
  },
  emits: ['update:value', 'tagClose'],
  setup(props, ctx) {
    const that = reactive({})

    const handleShowDialog = () => {
      ctx.emit('update:value', true)
    }

    // 标签删除数据
    const tagClose = (tag) => {
      const i = props.checkedResult.findIndex(item => (item as any)[props.props.id] === tag[props.props.id])
      ctx.emit('tagClose', i)
    }
    // const labelList = computed(() => {
    //   const labels = props.labels.split(',')

    //   const ids = props.ids.split(',')
    //   const arr:any [] = []
    //   labels.forEach((element, index) => {
    //     const obj = {}
    //     obj[props.props.id] = ids[index]
    //     obj[props.props.label] = labels[index]
    //     arr.push(obj)
    //   })
    //   return arr
    // })
    return {
      ...toRefs(that), handleShowDialog, tagClose
    }
  }
})
</script>
<style lang="scss" scoped>
.selected-tag-container {
  border: 1px solid rgb(220, 223, 230);
  // width: 100%;
  border-radius: 5px;
  padding: 0 5px 0 15px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .tag-list {
    flex: 1;
    .tag-item {
      margin-right: 8px;
    }
  }
}
.button-box {
  display: flex;
  align-items: center;
}
</style>
