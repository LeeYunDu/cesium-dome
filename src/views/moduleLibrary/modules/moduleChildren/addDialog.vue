/*
*说明: 退役军人新增/修改表单提交
*创建者: 李云都
*日期: 2021-07-12
*/
<template>
  <div>
    <form-dialog
      ref="formDialog"
      :model="ruleForm"
      v-bind="$attrs"
      :rules="rule"
      @submitForm="submitForm"
      @closed="closed"
    >
      <el-col :span="12">
        <el-form-item label="姓名" prop="name"><el-input v-model="ruleForm.name" placeholder="请输入姓名" /></el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="身份证号码" prop="idCard"> <el-input v-model="ruleForm.idCard" /> </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="联系方式" prop="phone"> <el-input v-model="ruleForm.phone" /> </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="选人组件应用">
          <targetSelect
            v-model:checked="selectPerson"
            v-model:ids="ruleForm.selectIds"
            v-model:labels="ruleForm.selectLabels"
            :data="data"
            title="用户选择"
            :props="{label: 'name',id:'id'}"
            @submit="selectResult"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="返回选人组件选中的ids" prop="selectIds"><el-input v-model="ruleForm.selectIds" placeholder=" " /></el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="返回选人组件选中的labels" prop="selectLabels"><el-input v-model="ruleForm.selectLabels" placeholder=" " /></el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="文件上传">
          <UploadFile
            v-model:value="ruleForm.fileData"
            limit="2"
            :multiple="true"
            :need-field="['fileName','filePath']"
          />
          {{ ruleForm.fileData }}
        </el-form-item>

      </el-col>
    </form-dialog>
  </div>
</template>
<script>
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, ref, toRefs, onMounted } from 'vue'
import { validatorPhone, validatorIdCard } from '@/utils/regular'
import { getTargetSelectData } from '@/utils/targetSelect'
import { uploadFile } from '@/api/system'
import { getToken } from '@/utils/auth'

export default defineComponent({
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const refs = reactive({
      formDialog: null
    })
    const that = reactive({
      saveLoading: false,
      selectPerson: [],
      data: []

    })
    // 定义表单字段
    const form = {
      'name': '',
      'phone': '',
      'idCard': '',
      'selectIds': '',
      'selectLabels': '',
      'fileData': ''
    }
    // 将字段定义成响应式
    const ruleForm = ref(JSON.parse(JSON.stringify(form)))

    // 表单规则
    const rule = reactive({
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      phone: [{ required: true, validator: validatorPhone, trigger: 'blur' }],
      idCard: [{ required: true, validator: validatorIdCard, trigger: 'blur' }]
    })

    // 表单提交
    const submitForm = async(value) => {
      ElMessage.info('表单提交成功');
      (refs.formDialog).close()
    }

    // 设置展示字段的值
    const setRuleForm = async(value) => {
      ruleForm.value = { ...value }
    }

    // 表单重置
    const closed = () => {
      ruleForm.value = form
    }

    onMounted(() => {
      // 获取数据类型为type的选人数据
      getTargetSelectData(['user', 'dept']).then(res => {
        that.data = res
      })
    })

    const myHeaders = ref({ Authorization: `Bearer ${getToken()}` })

    return {
      ...toRefs(that),
      ...toRefs(refs),
      ruleForm, rule, submitForm, closed, setRuleForm, uploadFile, myHeaders
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
