<template>
  <div class="legend-contaienr">
    <div class="legend-list">
      <div
        v-for="item in legendList"
        :key="item.id"
        class="legend-item"
        @click="handlerClick(item)"
      >
        <div
          :class="['legend-check',checkedList.includes(item.id)?'isChecked':'']"
        />
        <div class="legend-icon" :style="{'background':item.borderColor}">
          <div class="legend-circle" :style="{'background':item.color}" />
        </div>
        <div class="legend-label">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getCesium, getInstance } from '../../js/cesiumUnit'
export default defineComponent({
  setup() {
    const router = useRouter()
    const that = reactive({
      legendList: [
        { label: '流调溯源队伍', id: 'ldsyTeam', color: 'rgb(255,187,0)', borderColor: 'rgba(255,187,0,0.4)', type: 'traceability' },
        { label: '社区封控队', id: 'fkjdTeam', color: 'rgb(0,255,180)', borderColor: 'rgba(0,255,180,0.4)', type: 'traffic' },
        { label: '核酸检测队', id: 'hscyTeam', color: 'rgb(255,71,71)', borderColor: 'rgba(255,71,71,0.4)', type: 'collect' },
        { label: '物资储备清单', id: 'fkwzcbList', color: 'rgb(0,252,255)', borderColor: 'rgba(0,252,255,0.4)', type: 'warehouse' },
        { label: '集中点隔离清单', id: 'gldList', color: 'rgb(25,171,251)', borderColor: 'rgba(25,171,251,0.4)', type: 'isolated' },
        { label: '核酸采样点清单', id: 'lshsjcdList', color: 'rgb(36,131,255)', borderColor: 'rgba(36,131,255,0.4)', type: 'sampling' }
      ],
      checkedList: [],
      dataSourceMap: {

      },
      legendData: {
        traceability: null,
        traffic: null,
        collect: null,
        warehouse: null,
        isolated: null,
        sampling: null
      }
    })

    const handlerClick = (item) => {
      const index = that.checkedList.indexOf(item.id)

      // 没有就添加
      if (index === -1) {
        that.checkedList.push(item.id)
        if (that.legendData[item.type]) {
          addLegendMarker(item, that.legendData[item.type])
          return
        } else {
          const params = {
            pointType: item.type,
            areaCode: store.getters.areaCode
          }
          getLegendListApi(params).then(res => {
            that.legendData[item.type] = res.data
            addLegendMarker(item, that.legendData[item.type])
          })
        }
      } else {
        // 删除dataSource
        const viewer = getInstance()
        const deleteItem = that.checkedList.splice(index, 1)[0]
        viewer.dataSources.remove(that.dataSourceMap[deleteItem])
      }
    }

    // 添加点位
    const addLegendMarker = (item, markerData) => {
      const Cesium = getCesium()
      const viewer = getInstance()

      // 创建数据源
      const dataSource = new Cesium.CustomDataSource(item.type)
      viewer.dataSources.add(dataSource)
      // 存储数据
      that.dataSourceMap[item.id] = dataSource
      // 图标宽度、高度映射
      const markerWidthMap = {
        ldsyTeam: { width: 27, height: 42 },
        fkjdTeam: { width: 27, height: 42 },
        hscyTeam: { width: 27, height: 42 },
        fkwzcbList: { width: 38, height: 38 },
        gldList: { width: 38, height: 38 },
        lshsjcdList: { width: 38, height: 38 }
      }
      markerData.forEach(element => {
        // const img = require(`@/assets/cesium/icon-${item.id}.png`)
        const img = null
        const markerSize = markerWidthMap[item.id]
        if (element.lat) {
          const lnglat = element.lat.split(',')
          const entity = {
            id: `${item.id}${element.pointId}`, // id 保持唯一性
            markerInfo: element,
            onClick: (params) => { handlerMarkerClick(params, element) },
            show: true,
            position: Cesium.Cartesian3.fromDegrees(lnglat[0], lnglat[1], 50),
            billboard: {
              image: img,
              name: element.name,
              show: true,
              width: markerSize.width,
              height: markerSize.height
            }
          }
          dataSource.entities.add(entity)
        }
      })
    }
    const handlerMarkerClick = (movement, element) => {
      const params = {
        pointId: element.pointId,
        pointType: element.pointType
      }

      // handleMarkeInfo(element)
    }

    let entityClick = null
    // markerInfo 弹窗
    let entityInstance = null
    const store = useStore()
    const handleMarkeInfo = (element) => {
      store.dispatch('cesium/setData', { key: 'markerInfo', value: element })
      const Cesium = getCesium()
      const viewer = getInstance()
      // 如果存在则先删除
      deleteMarkerInfo()
      const entityOption = {
        id: 'markerInfo',
        name: 'markerInfo',
        position: Cesium.Cartesian3.fromDegrees(element.longtitude, element.latitude),
        label: {
          text: ' ',
          show: true,
          font: '18px Helvetica'
        }
      }
      const entity = viewer.entities.add(entityOption)
      entityInstance = entity
      // 根据entity的position 做 makrerInfo相对于屏幕定位
      const tooltipContainer = document.querySelector('.marker-toolip-container')
      const markerInfoPanel = document.querySelector('#marker-popup')
      console.log(markerInfoPanel.style)
      markerInfoPanel.style.display = 'block'
      entityClick = () => {
        /**
         * 获取该点位entity 在场景中的position,会根据地图偏移而改变
         * 所以添加postRener事件去监听,这样就做到实时刷新popup位置
         */

        try {
          const entityPosition = new Cesium.Cartesian3(entity._position._value.x, entity._position._value.y, entity._position._value.z)
          const scenePosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, entityPosition)
          // 样式设置  这里为了居中显示 减去了弹框的高度、宽度 120 和 240
          tooltipContainer.style.top = (scenePosition.y - tooltipContainer.clientHeight / 2 - 120) + 'px'
          tooltipContainer.style.left = (scenePosition.x - 240) + 'px'
        } catch (error) {
          // console.log(error)
        }
      }

      // 事件监听实时刷新
      viewer.scene.postRender.addEventListener(entityClick)
      // popup关闭事件
      setTimeout(() => {
        const markerCloseButton = document.querySelector('.marker-close-button')
        markerCloseButton.onclick = () => {
          deleteMarkerInfo()
        }
      }, 0)
    }
    // 关闭信息点位
    const deleteMarkerInfo = () => {
      const viewer = getInstance()
      if (entityInstance) {
        const markerInfoPanel = document.querySelector('#marker-popup')
        markerInfoPanel.style.display = 'none'
        viewer.scene.postRender.removeEventListener(entityClick)
        viewer.entities.remove(entityInstance)
      }
    }

    onMounted(() => {
      // 进入地图默认加载全部点位
      that.legendList.forEach(e => {
        handlerClick(e)
      })
    })
    return {
      ...toRefs(that), handlerClick
    }
  }
})
</script>

<style lang='scss'>
.legend-contaienr{
  position: absolute;
  right: 472px;
  bottom: 30px;
  .legend-list{
    display: flex;
    flex-direction: column;
    background: rgba($color: #102844, $alpha: 0.88);
    padding: 12px;
    border-radius: 8px;
    box-sizing: border-box;
    border: 1px solid #0d6894;
    box-shadow: 0 0 8px rgba($color: #19b1fb, $alpha: 0.25);
    .legend-item{
      margin-right: 10px;
      color: white;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .legend-check{
        width: 14px;
        height: 14px;
        background:#102844;
        border: 1px solid #19b1fb;
        cursor: pointer;
        position: relative;
        border-radius: 3px;
      }
      .isChecked{
        background: #19b1fb;
        &::after{
          content: '\2714';
          position: relative;
          top: -4px;
          color: black;
        }
      }
      .legend-icon{
        width: 16px;
        height: 16px;
        box-sizing: border-box;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 6px;
        .legend-circle{
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
      }
    }

  }
}
</style>
