<template>
  <div v-if="fileList.length > 0" class="file-table-container">
    <el-table :data="fileList" style="width: 100%;" :show-header="false">
      <el-table-column prop="fileName" label="文件名">
        <template #default="scope">
          <el-button size="mini" type="text" class="nameButton" :title="scope.row.fileName" @click="handleOpenFile(scope.row)"> <span>{{ scope.row.fileName }}</span> </el-button>
          <el-button v-if="previewButton(scope.row)" size="mini" @click="handleOpenFile(scope.row)">预览</el-button>
          <el-button type="primary" size="mini" class="button" @click="handleDownloadFile(scope.row)">下载</el-button>
          <template v-if="!isView">
            <el-button type="danger" size="mini" @click="handleEntityFileDelete(scope.$index)">删除</el-button>
          </template>
          <!-- <el-button v-if="showpdfbtn&&!isPDf&&!scope.row.nonsupport" size="mini" @click="handleOpenFile(pdfList)">查看pdf</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
  <ElImageViewer
    v-if="showViewer"
    :url-list="urlList"
    @close="showViewer=false"
  />
</template>
<script lang='ts'>
import { defineComponent, reactive, toRefs } from 'vue'
import { ElImageViewer, ElMessage } from 'element-plus'
import download from '@/utils/download'

export default defineComponent({
  components: {
    ElImageViewer
  },
  props: {
    fileList: {
      type: Array,
      default: () => []
    }
  },
  emits: ['handleEntityFileDelete'],
  setup(props, ctx) {
    const that = reactive({
      showViewer: false,
      urlList: [],
      baseUrl: process.env.VUE_APP_BASE_API + `/sos-files/allowFile/`
    } as any)
    const handleOpenFile = (file) => {
      // 文件预览分类,如果是图片类型直接采用element-plus的预览方式,如果是文档形式则以新标签的形式打开
      const { filePath } = file
      const fileType = getFileType(filePath)
      // 图片预览
      if (['png', 'jpeg', 'jpg', 'gif'].includes(fileType)) {
        that.urlList = [that.baseUrl + filePath]
        that.showViewer = true
      } else if (['doc', 'docx', 'pdf'].includes(fileType)) {
      // 文件预览,关于PDF页面内直接预览 需要通过office365服务,然后在iframe的方式打开
        window.open(that.baseUrl + filePath)
      } else {
        ElMessage.info('不支持该类型文件预览')
      }
    }

    // 文件下载
    const handleDownloadFile = (file) => {
      const { filePath } = file
      download(that.baseUrl + filePath, file.fileName)
    }

    // 文件删除
    const handleEntityFileDelete = (index) => {
      ctx.emit('handleEntityFileDelete', index)
    }

    // 文件预览按钮是否显示
    const previewButton = (file) => {
      const canPreview = ['doc', 'docx', 'pdf', 'png', 'jpeg', 'jpg']
      const { filePath } = file
      const fileType = getFileType(filePath)
      return canPreview.includes(fileType)
    }

    // 获取文件类型
    const getFileType = (filePath) => {
      const index = filePath.lastIndexOf('.')
      const fileType = filePath.slice(index + 1, filePath.length).toLowerCase()
      return fileType
    }
    return {
      ...toRefs(that),
      handleEntityFileDelete, handleDownloadFile, handleOpenFile, previewButton
    }
  }
})
</script>
<style lang="scss" scoped>
.file-table-container{

}
</style>
