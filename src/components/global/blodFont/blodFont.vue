<template>
  <div class="font-blod">

    <slot />
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BlodFont'
})
</script>

<style lang='scss' scoped>
.font-blod{
  font-size: 20px;
  font-weight: 800;
}
</style>
