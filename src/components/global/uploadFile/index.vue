<template>
  <div>
    <el-upload
      v-if="!isView"
      class="upload-file-tool"
      :drag="isDrag"
      :action="url"
      :multiple="multiple"
      :limit="limit"
      v-bind="$attrs"
      :headers="headers"
      :with-credentials="true"
      :accept="accept"
      :name="name"
      :show-file-list="false"
      :before-upload="handleBeforeUpload"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed"
    >

      <!-- 上传交互模式：拖拽文件形式 或  按钮点击模式 -->
      <template v-if="isDrag">
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处或 <em>点击此处上传</em>
        </div>
      </template>
      <template v-else>
        <el-button type="primary" size="mini ">{{ uploadText }}</el-button>
      </template>

      <template #tip>
        <div class="el-upload__tip" />
      </template>
    </el-upload>
    <!-- 上传进度条动画 -->
    <div v-if="showPercentage" class="progress-box"><el-progress :percentage="percentageNumber" :status="percentageState" /></div>
    <fileList
      v-bind="$attrs"
      :file-list="fileList"
      @handleEntityFileDelete="handleEntityFileDelete"
    />
  </div>
</template>
<script lang='ts'>
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { getToken } from '@/utils/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import fileList from './components/fileList.vue'
import { fileFields } from './types/index'
export default defineComponent({
  name: 'UploadFile',
  components: {
    fileList
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: process.env.VUE_APP_BASE_API + `/sos-files/files/manager/allow/upload`
    },
    // 文件上传接受的文件格式类型
    accept: {
      type: String,
      default: '.doc,.docx,.pdf,.xls,.xlsx,.jpg,.jpeg,.png,.ceb,.tiff,.txt'
    },
    // 文件上传传输字段
    name: {
      type: String,
      default: 'file'
    },
    // 按钮文字
    uploadText: {
      type: String,
      default: '上传文件'
    },

    // 视图模式 - 只显示绑定的文件列表,不显示上传组件
    isView: {
      type: Boolean,
      default: false
    },
    // 是否上传多个文件
    multiple: {
      type: Boolean,
      default: false
    },
    // 文件上传个数限制
    limit: {
      type: Number,
      default: null
    },
    // 文件上传携带的参数
    data: {
      type: Object,
      default: () => {}
    },
    // 是否拖拽上传
    isDrag: {
      type: Boolean,
      default: true
    },

    // 最终输出的文件对象所需要的字段
    needField: {
      type: Array,
      default: () => ['id', 'fileName', 'filePath']
    }

  },
  emits: ['error', 'update:value'],
  setup(props, ctx) {
    const that = reactive({
      // 请求头携带token
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
      fileList: []
    } as any)

    // 组件初始化,处理双向绑定文件列表字段
    const init = () => {
      try {
        if (props.value.length > 0) {
          const fileList = JSON.parse(props.value)
          that.fileList = fileList
        }
      } catch (error) {
        that.fileList = []
      }
    }

    init()

    // 监听文件列表变化,抛出结果
    watch(that.fileList, (file) => {
      const result:Array<any> = []
      file.forEach((element:any) => {
        const resuleFile:any = {}
        props.needField.forEach((key:any) => {
          resuleFile[key] = element[key] || undefined
        })
        result.push(resuleFile)
      })
      ctx.emit('update:value', result.length > 0 ? JSON.stringify(result) : '')
    })

    // 文件上传前拦截
    const handleBeforeUpload = async(file) => {
      return new Promise((resolve, reject) => {
        const filePath = file.name
        const index = filePath.lastIndexOf('.')
        const fileType = filePath.slice(index, filePath.length).toLowerCase()
        const isLt10M = file.size / 1024 / 1024 < 10
        // 文件类型上传判断处理
        if (props.accept.includes(fileType)) {
          resolve(true)
        } else if (!isLt10M) {
          ElMessage.info('不支持文件大小超过10M')
          reject(false)
        } else {
          ElMessage.info('不支持该类型文件上传')
          reject(false)
        }
      })
    }

    // 文件上传所涉及到的字段
    const fileProgress = reactive({
      showPercentage: false, // 是否显示
      percentageState: null, // 上传状态
      percentageTime: undefined, // 上传动画定时器
      percentageNumber: 0

    } as any)

    // 文件上传时
    const handleProgress = () => {
      fileProgress.showPercentage = true
      fileProgress.percentageState = null
      fileProgress.percentageNumber = 0
      fileProgress.percentageTime = setInterval(() => {
        const speed = Number((100 - fileProgress.percentageNumber) / 10)
        fileProgress.percentageNumber = parseInt((fileProgress.percentageNumber + speed) as any)
      }, 500) as any
    }

    // 文件上传成功
    const handleSuccess = (response, file, fileList:Array<fileFields>):void => {
      // 清除动画定时器
      clearInterval(fileProgress.percentageTime)
      fileProgress.percentageNumber = 100
      fileProgress.percentageState = ('success') as any
      setTimeout(() => {
        fileProgress.showPercentage = false
      }, 1000)
      // 文件存储
      that.fileList.push((response.data as fileFields))
    }

    // 文件上传失败
    const handleError = (err, file, fileList:Array<fileFields>) => {
      ctx.emit('error', err, file, fileList)
      clearInterval(fileProgress.percentageTime)
      fileProgress.percentageState = 'exception'
      setTimeout(() => {
        fileProgress.showPercentage = false
        fileProgress.percentageNumber = 0
      }, 3000)
      ElMessage.error('文件上传失败！')
    }

    // 删除文件列表的文件
    const handleEntityFileDelete = (index) => {
      ElMessageBox.confirm(
        '是否删除该文件 ?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          that.fileList.splice(index, 1)

          ElMessage({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(() => {

        })
    }

    // 文件超出个数限制时的钩子
    const handleExceed = () => {
      ElMessage.info(`文件上传${props.limit}个数超出限制`)
    }
    return {
      ...toRefs(that), ...toRefs(fileProgress),
      handleBeforeUpload, handleProgress, handleSuccess, handleError, handleEntityFileDelete, handleExceed
    }
  }
})
</script>

<style lang='scss'>
.upload-file-tool {
  .el-upload-dragger {
    height: 150px !important;
    width: 240px !important;
  }
}
.progress-box {
  max-width: 200px;
  height: 40px;
  display: flex;
  align-items: center;
  box-sizing: content-box;
  padding-left: 10px;
  .el-progress {
    width: 100%;
  }
}
</style>
