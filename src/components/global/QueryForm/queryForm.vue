<template>
  <div>
    <div class="table-slot">
      <el-form
        id="query-form"
        ref="ruleForm"
        label-position="left"
        :inline="true"
        class="query-form"
        size="mini"
        :rules="rules"
        :model="model"
      >
        <div class="query-box">
          <slot name="formItem-first" />
          <div v-for="(item,index) in data" :key="index" class="query-item">
            <el-form-item :label="item.label" :prop="(item.type!=='doubleTime' && item.type!=='doubleTime_datetimerange')?item.key:''">
              <el-input
                v-if="item.type=='text'"
                v-model="model[item.key]"
                :style="{width:item.width + 'px'}"
                :type="item.inputType||'text'"
                clearable
                :placeholder="item.placeholder||''"
              />
              <el-date-picker
                v-if="item.type=='singleTime'"
                v-model="model[item.key]"
                clearable
                type="date"
                placeholder="选择时间"
                value-format="yyyy-MM-dd"
                style="width: 150px; padding-right: 0;"
              />
              <el-date-picker
                v-if="item.type=='doubleTime'"
                v-model="doubleTime"
                :style="{width:item.width + 'px'}"
                clearable
                type="daterange"
                :range-separator="item.range_separator||'至'"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :format="item.format||'yyyy-MM-dd'"
                :value-format="item.value_format||'yyyy-MM-dd'"
                :default-time="['00:00:00', '23:59:59']"
              />
              <el-date-picker
                v-if="item.type=='doubleTime_datetimerange'"
                v-model="doubleTime_datetimerange"
                :style="{width:item.width + 'px'}"
                clearable
                type="datetimerange"
                :range-separator="item.range_separator||'至'"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :format="item.format||'yyyy-MM-dd'"
                :value-format="item.value_format||'yyyy-MM-dd'"
                :default-time="['00:00:00', '23:59:59']"
              />
              <el-select
                v-if="item.type=='option'"
                v-model="model[item.key]"
                :style="{width:item.width + 'px'}"
                clearable
                :placeholder="item.placeholder||''"
              >
                <el-option
                  v-for="(object,option_index) in item.options"
                  :key="option_index"
                  :label="object[item.optionConfig.labelKey]"
                  :value="object[item.optionConfig.valueKey]"
                />
              </el-select>
            </el-form-item>

          </div>
          <slot name="formItem" />
          <el-form-item class="query-btn">
            <el-button size="mini" type="primary" @click="handleQuery">查询</el-button>
          </el-form-item>
          <el-form-item v-if="resetButton" class="query-btn">
            <el-button size="mini" type="primary" @click="resetForm">重置</el-button>
          </el-form-item>
          <slot name="btns" @set_export_data="set_export_data" />
        </div>
        <div />
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QueryForm',
  directives: {
    width: {
      inserted: (el, binding) => {
        // 自定义 input 框的 宽度
        el.style.width = `${binding.value || 150}px`
      }
    }
  },
  props: {
    // 配置input框
    data: {
      type: Array,
      default: () => []
    },
    // 是否显示重置按钮
    resetButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: {},
      doubleTime: [],
      doubleTime_datetimerange: []
    }
  },
  computed: {
    // 表单规则验证 - 暂时支持简单的类型 验证 如身份证 手机 字符串是否为空 后续可升级为 自定义传入验证方法 2020.09.22
    rules() {
      const validatorGroup = {}
      this.data.forEach(item => {
        if ('validator' in item) {
          const validator = this.switchValidator(item.validator)
          const obj = [
            { validator, trigger: 'blur' }
          ]
          validatorGroup[item.key] = obj
        }
      })
      return validatorGroup
    }
  },
  watch: {
    data: {
      handler(val) {
        // 处理传入数据 整合为model
        if (val) {
          const model = {}
          val.forEach(item => {
            model[item.key] = ''
          })
          this.model = model
        }
      },
      immediate: true
    }
  },
  methods: {
    handleQuery() {
      this.$refs['ruleForm'].validate(async(valid) => {
        if (valid) {
          const params = {}
          this.data.forEach(e => {
            if (e.type === 'doubleTime' || e.type === 'doubleTime_datetimerange') {
              if (this.notisBlank(this.doubleTime)) {
                params[e.key[0]] = this.doubleTime[0] || ''
                params[e.key[1]] = this.doubleTime[1] || ''
              } else if (this.notisBlank(this.doubleTime_datetimerange)) {
                params[e.key[0]] = this.doubleTime_datetimerange[0] || ''
                params[e.key[1]] = this.doubleTime_datetimerange[1] || ''
              } else {
                params[e.key[0]] = ''
                params[e.key[1]] = ''
              }
            } else {
              params[e.key] = this.model[e.key]
            }
          })
          // 调整日期
          if (params.endTime) {
            params.endTime += ' 23:59:59'
          }
          this.$emit('setParam', params)
        }
      })
    },
    // 重置表单
    resetForm() {
      for (const key in this.model) {
        if (this.model.hasOwnProperty(key)) {
          this.model[key] = null
        }
      }
    },
    // 表单验证方法
    switchValidator(type) {
      let fn = null
      switch (type) {
        case 'null':
          fn = this.isBlank
          break
        case 'IdCard':
          fn = this.validatorIdCard
          break
        case 'phone':
          fn = this.validatorPhone
          break
      }
      return fn
    },
    // 是否为空对象 空数组 空字符串 验证
    isBlank(rule, value, callback) {
      if (value === '' || value === undefined || value == null || JSON.stringify(value) === '{}' || JSON.stringify(value) === '[]') {
        callback(' ')
      }
      callback()
    },
    // 身份证验证
    validatorIdCard(rule, value, callback) {
      const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (value === '') {
        callback()
      } else if (value && !regIdCard.test(value)) {
        return callback(new Error('请输入正确的身份证号码'))
      } else {
        callback()
      }
    },
    // 手机格式验证
    validatorPhone(rule, value, callback) {
      const regPhone = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
      if (rule.required && value === '') {
        callback('请输入手机号码')
      } else if (value === '') {
        callback('')
      } else if (!regPhone.test(value)) {
        return callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    },
    // 判断不为空
    notisBlank(object) {
      if (object === '' || object === undefined || object == null || JSON.stringify(object) === '{}' || JSON.stringify(object) === '[]') {
        return false
      }
      return true
    }
  }
}
</script>

<style lang='scss' scoped>
.query-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .query-item {
    flex: 0 0 1;
  }
}

</style>
<style lang="scss">
.table-slot {
  margin-bottom: 10px;
  .query-form {
    .query-box {
      .el-form-item__label-wrap {
        margin-left: 0 !important;
      }
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .query-btn {
      margin-bottom: 0;
    }
  }
}
</style>
