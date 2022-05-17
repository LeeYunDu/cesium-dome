<template>
  <div class="route-plan-container">
    <div>
      <el-input
        v-model="startPoint"
        disabled
        placeholder="请选中起点坐标"
        :prefix-icon="Search"
      >
        <template #prepend>
          起点
        </template>
        <template #append>
          <div class="route-planning-icon">
            <el-icon @click="pick('startPoint')"><AddLocation /></el-icon>

          </div>
        </template>
      </el-input>
    </div>
    <div>
      <el-input
        v-model="endPoint"
        disabled
        placeholder="请选中终点坐标"
        :prefix-icon="Search"
      >
        <template #prepend>
          终点
        </template>
        <template #append>
          <div class="route-planning-icon">
            <el-icon @click="pick('endPoint')"><AddLocation /></el-icon>
          </div>
        </template>
      </el-input>
    </div>
    <div style="margin:10px 0 0 10px">
      <el-button type="primary" size="mini" @click="queryRoutePlanning">路径规划</el-button>
      <div class="tip">该路径采用驾驶模式进行模拟,还包括其他出行方式(步行、公交、骑行、货车) <br> <a target="blank" href="https://lbs.amap.com/api/webservice/guide/api/direction#bus">服务调用请查看</a> </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watchEffect } from 'vue'
import { AddLocation } from '@element-plus/icons'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import carIcon from './car.png'
import axios from 'axios'
import { getCesium, getInstance } from '../../js/cesiumUnit'
export default defineComponent({
  components: {
    AddLocation
  },
  setup() {
    const that = reactive({
      startPoint: '',
      endPoint: '',
      czmlInstance: null
    })

    const store = useStore()
    watchEffect(() => {
      that.startPoint = store.getters.routePlanning.startPoint
      that.endPoint = store.getters.routePlanning.endPoint
    })
    const pick = (type) => {
      ElMessage.info(`请选择${type === 'startPoint' ? '起点' : '终点'}`)
      store.dispatch('cesium/setRoutePlanning', { key: 'status', value: type })
    }
    // 调用高德服务API
    /**
     * 路径规划
     * 接口返回的数据是数组,然后有路线方案可以做选择
     *
     */

    const queryRoutePlanning = () => {
      const key = '245a7cba5b970986ce852842356d1779'
      axios.get(
        `https://restapi.amap.com/v3/direction/driving?origin=${that.startPoint}&destination=${that.endPoint}&output=json&key=${key}`,
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      ).then(res => {
        const Cesium = getCesium()
        const viewer = getInstance()
        // 存在则先删除
        if (that.czmlInstance)viewer.dataSources.remove(that.czmlInstance)
        // 选择路线
        const path = res.data.route.paths[0]
        // 路线字段包括 距离 - 时间(秒) - 路径街道
        const { distance, duration, steps } = path
        // 拼合路线线段数据
        const cartographicDegrees = []
        const linePoints = []
        let index = 0
        steps.forEach((element) => {
          const split = element.polyline.split(';')
          // 整合动态轨迹的数据
          split.forEach((lnglat) => {
            const arr = lnglat.split(',')
            cartographicDegrees.push(index * 10) // 动画时间间隔
            cartographicDegrees.push(arr[0])// 经度
            cartographicDegrees.push(arr[1])// 维度
            cartographicDegrees.push(0)// 高度
            index++
            // 整合具体线的数据
            linePoints.push(arr[0])
            linePoints.push(arr[1])
            linePoints.push(0)
          })
        })
        // 绘制CZML格式的动态轨迹
        const czml = [
          {
            id: 'document',
            name: 'route Planning Path',
            version: '1.0',
            clock: {
              interval: '2012-08-04T10:00:00Z/2012-08-04T15:00:00Z', // 开始时间
              currentTime: '2012-08-04T10:00:00Z', // 结束时间
              multiplier: 10 // 播放倍速
            }
          },
          {
            id: 'routePlanning',
            name: 'path with GPS flight data',
            path: {
              material: {
                polylineOutline: {
                  color: {
                    rgba: [255, 0, 255, 255]
                  },
                  outlineColor: {
                    rgba: [0, 255, 255, 255]
                  },
                  outlineWidth: 5
                }
              },
              width: 0, // 运动轨迹线的宽度
              leadTime: 10, // 超前时间
              trailTime: 1000,
              resolution: 5
            },
            billboard: {
              image: carIcon,
              scale: 1,
              eyeOffset: {
                cartesian: [0.0, 0.0, -10.0]
              },
              scaleByDistance: new Cesium.NearFarScalar(1500, 1, 300000, 1),
              translucencyByDistance: new Cesium.NearFarScalar(1500, 1, 300000, 1),
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 300000)
            },
            polyline: {
              positions: {
                cartographicDegrees: linePoints
              },
              material: {
                solidColor: {
                  color: {
                    rgba: [255, 255, 0, 255]
                  }
                }
              }
            },
            position: {
              epoch: '2012-08-04T10:00:00Z', // 开始时间
              cartographicDegrees: cartographicDegrees
            }
          }

        ]

        viewer.dataSources
          .add(Cesium.CzmlDataSource.load(czml))
          .then(function(ds) {
            that.czmlInstance = ds
            // 开启跟踪动画
            // viewer.trackedEntity = ds.entities.getById('routePlanning')
          })
      })
    }
    return {
      ...toRefs(that), pick, queryRoutePlanning
    }
  }
})
</script>

<style lang='scss' scoped>
.route-plan-container{
  width: 350px;
}
.route-planning-icon{
  cursor: pointer;
}
</style>
