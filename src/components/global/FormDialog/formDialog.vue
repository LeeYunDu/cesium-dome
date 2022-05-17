<template>
  <div>
    <el-dialog
      v-model="visible"
      v-bind="$attrs"
      width="70%"
      append-to-body
      destroy-on-close
      lock-scroll
      :before-close="close"
    >
      <el-form
        ref="ruleForm"
        :model="model"
        :rules="rules"
        label-width="auto"
        size="small"
      >
        <el-row :gutter="20">
          <slot />
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <!-- 详情的时候没有保存按钮 通过if判断好像也不是最好的解决方法  等待一个优化 -->
          <el-button v-if="dialogType!='detail'" size="mini" type="primary" @click="submitForm">保存</el-button>
          <el-button size="mini" @click="close">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang='ts'>
import { defineComponent, reactive, ref, toRefs, watch, unref } from 'vue'

export default defineComponent({
  name: 'FormDialog',
  props: {

    value: {
      type: Boolean,
      default: false
    },
    // 表单数据绑定
    model: {
      type: Object,
      default: () => {}
    },
    // 表单验证规则
    rules: {
      type: Array,
      default: () => []
    },
    // 弹窗类型（新增、修改、详情 或者其他）
    dialogType: {
      type: String,
      default: ''
    }
  },
  emits: ['update:value', 'update:visible', 'update:model', 'submitForm'],
  setup(props, ctx) {
    const that = reactive({
      visible: false
    })

    // 显示弹窗
    watch(() => props.value, (val) => { if (val) { that.visible = true } })

    const ruleForm = ref<HTMLDivElement|null>(null)

    const submitForm = () => {
      (unref(ruleForm) as any).validate(async(valid) => {
        if (valid) {
          // 验证通过 表单提交
          ctx.emit('submitForm', valid)
        }
      })
    }

    // 关闭弹窗
    const close = () => {
      that.visible = false;
      // 重置表单字段
      (unref(ruleForm) as any).resetFields()

      ctx.emit('update:value', false)
    }
    return {
      ...toRefs(that),
      ruleForm,
      submitForm,
      close
    }
  }
})
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
</style>

<style >
.el-overlay {
  overflow-y: auto;
}
</style>
