<template>
  <div class="example-container">
    <div class="example-type-item">
      <el-dropdown>
        <el-button size="mini" type="primary">
          可视化<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="initAreaModel3DTileset()">城市建筑白膜</el-dropdown-item>
            <el-dropdown-item @click="initTyphoon()">台风轨迹</el-dropdown-item>
            <!-- <el-dropdown-item @click="drawPolymerizationPoint()">聚合点位</el-dropdown-item> -->

          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="example-type-item">
      <el-dropdown>
        <el-button size="mini" type="primary">
          动态效果<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="loadCloudLayout()">云层</el-dropdown-item>
            <el-dropdown-item @click="flickerPoint()">闪烁点</el-dropdown-item>
            <el-dropdown-item @click="flickerEllipse()">闪烁面</el-dropdown-item>
            <el-dropdown-item @click="flickerBillboard()">闪烁广告牌 </el-dropdown-item>
            <el-dropdown-item @click="dynamicTrack()">运动轨迹 </el-dropdown-item>

          </el-dropdown-menu>
        </template>

      </el-dropdown>
    </div>
    <div class="example-type-item">
      <el-dropdown>
        <el-button size="mini" type="primary">
          材质<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="createPolyLineMaterial()">轨迹线</el-dropdown-item>
            <el-dropdown-item @click="drawFlyLine()">飞线 </el-dropdown-item>
            <el-dropdown-item @click="drawFlowLine()">流动线 </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="example-type-item">
      <el-dropdown>
        <el-button size="mini" type="primary">
          路径规划<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <routePlanning />
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { initAreaModel3DTileset } from '../../js/cesium3DTileset'
import { loadCloudLayout } from '../../js/example/cloudLayout'
import { flickerPoint, flickerEllipse, flickerBillboard } from '../../js/example/flickerEntity'
import { initTyphoon } from '../../js/example/initTyphoon/index'
import { createPolyLineMaterial } from '../../js/example/dynamicMaterial/index'
import { dynamicTrack } from '../../js/example/dynamicTrack'
import { drawFlyLine } from '../../js/example/flyLine'
import { drawFlowLine } from '../../js/example/flowLine'
import { drawPolymerizationPoint } from '../../js/example/polymerization'
import routePlanning from '../routePlanning/index.vue'
export default defineComponent({
  components: {
    routePlanning
  },
  setup() {
    const that = reactive({
      initAreaModel3DTileset,
      loadCloudLayout,
      flickerPoint,
      flickerEllipse,
      flickerBillboard,
      initTyphoon,
      createPolyLineMaterial,
      dynamicTrack,
      drawFlyLine,
      drawFlowLine,
      drawPolymerizationPoint
    })

    return {
      ...toRefs(that)
    }
  }
})
</script>

<style lang='scss' scoped>
.example-container{
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  gap: 0 10px;
}
</style>
