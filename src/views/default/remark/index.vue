<template>
  <div class="home">
    <blod-font>Holle World!</blod-font>
    <h5>构建项目需求点集成</h5>
    <ul>
      <li v-for="(item,index) in featureList" :key="index">
        <el-checkbox v-model="item.checked">{{ item.title }}  <span v-if="item.marker" class="file-address">{{ item.marker }}</span>
          <div v-if="item.content" class="feature-content">
            {{ item.content }}
          </div>
        </el-checkbox>
      </li>
    </ul>
    <div v-width>测试指令width</div>
    <div v-test>测试指令test</div>
  </div>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Remark',

  setup() {
    const featureList = ref([

      { checked: true, title: '集成element-plus组件库' },
      { checked: true, title: '集成echarts 5.0以上版本' },
      { checked: true, title: '代码编写规范,集成eslint + .stylelintrc,实现自动格式化' },
      { checked: true, title: 'vuex,store管理,根据模块化自动注入' },
      { checked: true, title: 'vue全局组件注入', marker: '请查看文件地址 @/component/global' },
      { checked: true, title: 'vue全局指令注入' },
      { checked: true, title: 'vue 路由守卫的应用,', marker: '请查看文件地址 @/router/permission' },
      { checked: true, title: 'vue 路由丢失重定向至404页面,', marker: '请查看文件地址 @/router/index' },
      { checked: true, title: 'webpack实现css文件自动注入,mixins/global/variable', marker: '请查看文件 vue.config.js' },
      { checked: true, title: '关于vue3 + typescript 开发环境下的文件声明（图片格式、scss文件）', marker: '请查看文件 @/types/vue-app-env.d.ts' },
      { checked: true, title: '基于element表格组件的二次封装,（支持传入接口API、参数后直接展示数据）', marker: '请查看文件 @/components/global/customTable' },
      { checked: true, title: '[优化层面]webpack 打包配置时对大型依赖进行分割,如（element-plus、echarts）', marker: '请查看文件 vue.config.js', content: '项目部署后,运行的时候可以看到按模块加载js' }

    ])

    return {
      featureList
    }
  }
})
</script>
<style lang='scss' scoped>
.test {
  color: $test;
}
.file-address {
  color: #666666;
}
.feature-content {
  font-size: 14px;
  color: #999999;
}
</style>
