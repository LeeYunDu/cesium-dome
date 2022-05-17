/*
*说明: 详情界面案例编写
*创建者: 李云都
*日期: 2021-08-03
*/
<template>
  <form-dialog
    ref="formDialog"
    v-bind="$attrs"
    dialog-type="detail"
    @closed="closed"
  >
    <el-col :span="12">
      <el-form-item label="姓名" prop="name"> <span v-isEmpty="ruleForm.name" /> </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="身份证号" prop="idCard"> <span v-isEmpty="ruleForm.idCard" />  </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="联系方式" prop="phone"> <span v-isEmpty="ruleForm.phone" />  </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="附件查看" prop="phone">
        <UploadFile
          v-model:value="ruleForm.fileData"
          :is-view="true"
          limit="2"
          :multiple="true"
          :need-field="['fileName','filePath']"
        />
      </el-form-item>
    </el-col>
  </form-dialog>
</template>
<script>

import { defineComponent, reactive, ref, toRefs } from 'vue'

export default defineComponent({

  setup(props, ctx) {
    const form = {
      'name': '', // 是否已服役
      'phone': '', // 联系方式
      'idCard': '', // 身份证号
      'fileData': ''
    }

    const ruleForm = ref(form)

    const refs = reactive({
      formDialog: null
    })

    const that = reactive({
      saveLoading: false
    })

    const setRuleForm = async(value) => {
      ruleForm.value = { ...value }
    }
    // 表单重置
    const closed = () => {
      ruleForm.value = form
    }
    return {
      ...toRefs(that),
      ...toRefs(refs),
      ruleForm, setRuleForm, closed
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
