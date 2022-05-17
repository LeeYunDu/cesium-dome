<template>
  <div class="custom-table-container">
    <slot name="tableButton" />
    <slot name="tableBefore" />
    <el-table
      v-bind="$attrs"
      :data="tableData"
      border
      class="custom-table"
      :row-class-name="tableRowClassName"
      :cell-style="{'text-align':'center'}"
      :header-cell-style="{'text-align':'center'}"
      header-cell-class-name="custom-table-header"
    >
      <tableColumn v-for="(item,index) in tabelColumn" :key="setKey(item,index)" :column="item" />
      <!-- 自定义插槽 -->
      <slot name="tabelColumn" />
    </el-table>
    <!-- 分页按钮 -->
    <pagination
      v-if="showPagination"
      :current-page="pageConfig.current"
      :page-size="pageConfig.size"
      :total="total"
      :page-sizes="pageSizes"
      @current-change="changePage"
      @size-change="changePageSize"
    />

  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType, reactive, ref, watch, onMounted } from 'vue'
import { tableQuery } from './types/index'
import tableColumn from './components/tableColumn.vue'
import pagination from './components/pagination.vue'
export default defineComponent({
  name: 'CustomTable',
  components: {
    tableColumn, pagination
  },
  props: {
    pageSizes: {
      type: Array as any,
      default() {
        return []
      }
    },
    // 直接传入数据
    defaultData: {
      default: () => [],
      type: Array as PropType<Array<any>>
    },
    // 表格列
    tabelColumn: {
      type: Array as PropType<Array<object>>,
      default: () => []
    },
    // 获取列表接口
    tableDataApi: {
      default: null,
      type: Function as PropType<(tableQuery)=>Promise<any> >
    },
    // 获取列表参数
    tableQuery: {
      default: { size: 10, current: 1 },
      type: Object as PropType<tableQuery>
    },
    // 表格循环渲染 key值
    loopKey: {
      type: String,
      default: 'id'
    }
  },
  emits: ['success', 'changePage', 'changePageSize'],
  setup(props, ctx) {
    const tableData = ref<Array<any>>([])
    const total = ref<any>(0)
    const showPagination = computed(() => { return total.value > 0 })

    // 接口分页默认参数
    const pageConfig = reactive({
      current: 1,
      size: (props as any).tableQuery.size || 10
    })
    /**
     * 请求数据
     */
    const handlerApiData = () => {
      const query = Object.assign({}, (props as any).tableQuery, pageConfig);
      (props as any).tableDataApi(query).then(res => {
        if (res.code === 0) {
          let data:Array<any> = []

          data = res.data.records
          // 接口字段  每个项目都需要跟后台协商好 列表返回所取的字段

          // 数据需要特殊处理
          tableData.value = data
          total.value = Number(res.data.total)
          // 抛出成功事件
          ctx.emit('success', data)
        }
      })
    }
    /**
     * 更新表格数据
     */
    const updateTableData = () => {
      ((props as any).tableDataApi) && handlerApiData()
    }

    // 更改页面
    const changePage = (current) => {
      // 如果传入默认数据 抛出 当前页码变更 事件
      if ((props as any).defaultData.length > 0) {
        ctx.emit('changePage', current)
      } else {
        pageConfig.current = current
        handlerApiData()
      }
    }
    const changePageSize = (size) => {
      ctx.emit('changePageSize', size)
      pageConfig.size = size
      handlerApiData()
    }

    onMounted(() => {
      /**
       * 计算表格高度
       */

      handlerApiData()
    })

    // 在 v-for 循环渲染数据中不使用index作为key值,默认采用数据中的id字段作为唯一值,避免数据错位和性能消耗
    const setKey = (item, index) => {
      if ((props as any).loopKey in item) {
        return item[(props as any).loopKey]
      } else {
        return index
      }
    }
    return {
      tableData,
      total, showPagination,
      updateTableData,
      changePage, pageConfig, changePageSize,
      setKey
    }
  }
})
</script>

<style lang='scss' scoped>
.custom-table-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.pagination-box {
  padding: 0;
  padding-top: 10px;
  display: flex;
  justify-content: flex-end;
}
.custom-table {
  width: 100%;
  flex: 1;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}

</style>
<style lang='scss'>
.column_sky {
  color: #00eaff;
}
.custom-table {
  .custom-table-header {
    background-color: #f7f8fa;
    font-size: 12px;
    color: #666666;
    padding: 6px 0;

    // padding: 0;
  }
  .el-table__row {
    td {
      padding: 6px 0 !important;
    }
  }
}

</style>
