<template>

  <el-config-provider :locale="locale">
    <div class="app-wrapper">
      <router-view />
    </div>
  </el-config-provider>

</template>

<script>
import { ElConfigProvider } from 'element-plus'
import { defineComponent, ref } from 'vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
export default defineComponent({
  components: {
    [ElConfigProvider.name]: ElConfigProvider
  },
  setup() {
    const locale = ref(zhCn)
    return {
      locale
    }
  }
})
</script>
<style lang="scss">
.app-wrapper {
  width: 100%;
  height: 100%;
  // background: #08132f;
  // overflow: hidden;
}
</style>
