/*
*说明: 退役军人列表接口
*创建者: 李云都
*日期: 2021-07-12
*/
<template>
  <div class="module-container">
    <custom-table
      ref="listTable"
      :table-data-api="tableApi"
      :tabel-column="tabelColumn"
      :table-query="tableQuery"
      table-type="listTable"
    >
      <template #tableBefore>
        <div>
          <query-form :data="queryFormData" @setParam="setParam">
            <template #formItem>

              <el-form-item>
                <el-button size="mini" type="success" @click="exportData">数据导出</el-button>
              </el-form-item>

            </template>
          </query-form>
        </div>
      </template>
      <template #tableButton>
        <div class="table-component-btn">
          <el-button v-verifyRole="'sys_dict_add'" type="primary" size="small" @click="showAddDialog=true;edit=false">新增</el-button>
        </div>
      </template>
    </custom-table>
    <addDialog
      ref="addDialog"
      v-model:value="showAddDialog"
      :title="edit?'修改人员':'新增人员'"
      :edit="edit"
      @close="updataTable"
    />
    <detailDialog
      ref="detailDialog"
      v-model:value="showDetailDialog"
      title="详情"
    />
  </div>
</template>
<script lang='ts'>
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent, nextTick, reactive, ref, toRefs, unref, withDirectives, resolveDirective } from 'vue'
import detailDialog from './detailDialog.vue'
import addDialog from './addDialog.vue'
// import { getSoldierListApi, deleteSoldierApi, getSoldierInfoApi, exportSoldierDataApi, importSoldierDataApi } from '@/api/soldier'
import { downloadFile } from '@/utils/download'

import verifyRole from '@/directive/verifyRole'
export default defineComponent({
  name: 'ImportantTask',
  components: { addDialog, detailDialog },
  setup() {
    const refs = reactive({
      listTable: null,
      addDialog: null,
      detailDialog: null
    })

    const that = reactive({
      showAddDialog: false,
      edit: false,
      showDetailDialog: false,
      textArray: JSON.stringify([
        { id: 'id', fileName: 'fileName', filePath: 'filePath' },
        { id: 'id2', fileName: 'fileName1', filePath: 'filePath1' },
        { id: 'id3', fileName: 'fileName2', filePath: 'filePath2' }
      ])
    } as any)
    const testData = ref([
      {
        idCard: '330327199610097270', name: '测试用例', phone: '15168766725', selectIds: '1_1', selectLabels: '测试选人组件',
        fileData: '[{"fileName":"031B0567-DDA2-40d6-840D-DD6856B70A79.png","filePath":"2021/10/09/49f3c86c-1d4d-42a3-9299-557d5eef4844.png"},{"fileName":"vue3项目开发手册2.pdf","filePath":"2021/10/09/7e19e60e-c9f1-4813-a6a9-f164a1a6d2eb.pdf"}]'
      }
    ])
    // 配置表格列
    const tabelColumn = ref([
      { label: '序号', width: 'auto', type: 'index' },
      { label: '姓名', width: 'auto', prop: 'name' },
      { label: '联系方式', width: 'auto', prop: 'phone' },
      { label: '身份证号', width: 'auto', prop: 'idCard' },
      { label: '操作', width: 'auto', prop: 'date', render: (h, params) => {
        const value = params.row
        const temp:Array<any> = []

        temp.push(withDirectives(h(ElButton, {
          type: 'primary',
          size: 'mini',
          onClick: () => {
            ElMessage.info('render形式绑定指令写法')
          }

        }, '该按钮为render指令绑定'), [
          [verifyRole, 'sys_dict_add']
        ]))
        temp.push(h(ElButton, {
          type: 'primary',
          size: 'mini',
          onClick: () => {
            handleDetail(value)
          }

        }, '详情'))

        temp.push(h(ElButton, {
          type: 'success',
          size: 'mini',
          onClick: () => {
            handleEdit(value)
          }

        }, '修改'))

        temp.push(h(ElButton, {
          type: 'danger',
          size: 'mini',
          onClick: () => {
            handleDelete(value)
          }

        }, '删除'))

        return h('div', temp)
      } }

    ])

    // 列表查询所需要的参数
    const tableQuery = ref({
      limit: 15
    })

    // 列表查询条件配置配置
    const queryFormData = ref([
      { label: '姓名', key: 'nameLike', type: 'text', value: '', width: 110, placeholder: '请输入姓名' },
      { label: '身份证', key: 'idCardLike', type: 'text', width: 150, value: '', placeholder: '请输入身份证' }
    ])

    // 查询
    const setParam = async(value) => {
      tableQuery.value = { ...tableQuery.value, ...value }
      await nextTick()
      updataTable()
    }

    // 表格刷新
    const updataTable = () => {
      (refs.listTable as any).updateTableData()
    }

    // 删除人员
    const handleDelete = (row) => {
      ElMessageBox.confirm('此操作将删除该人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const value = row.idCard
          let i = -1
          testData.value.forEach((e, index) => {
            if (e.idCard === value) {
              i = index
            }
          })
          testData.value.splice(i, 1)

          ElMessage({
            type: 'success',
            message: '删除成功!'
          })
          updataTable()
        })
    }

    // 查看详情
    const handleDetail = async(row) => {
      (refs.detailDialog as any).setRuleForm(row)
      await nextTick()
      that.showDetailDialog = true
    }

    // 修改
    const handleEdit = async(row) => {
      await nextTick()
      that.edit = true;
      (refs.addDialog as any).setRuleForm(row)
      that.showAddDialog = true
    }

    // 数据导出
    const exportData = () => {
      // window.open(exportSoldierDataApi())
      // exportSoldierDataApi().then(res => {
      //   downloadFile(
      //     res,
      //     '现役军人数据.xlsx',
      //     'application/vnd.ms-excel'
      //   )
      // })
    }

    // 获取表格数据的接口
    const tableApi = (query) => {
      return new Promise((resolve, reject) => {
        const result = {
          code: 0,
          msg: '',
          data: {
            total: testData.value.length,
            records: testData.value
          }

        }
        resolve(result)
      })
    }
    return {
      ...toRefs(refs), ...toRefs(that),
      tabelColumn, queryFormData, tableQuery, setParam, updataTable,
      exportData, testData, tableApi
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
