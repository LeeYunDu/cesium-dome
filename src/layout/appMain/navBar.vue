<template>
  <div class="nav-container">
    <NavbarRightMenu />
  </div>
</template>
<script lang='ts'>
import { defineComponent } from 'vue'
import NavbarRightMenu from './components/NavbarRightMenu.vue'
export default defineComponent({
  components: {
    NavbarRightMenu
  }
})

</script>
<style lang="scss" scoped>
.nav-container {
  height: $navBarHeight;
  width: 100%;
  position: relative;
  overflow: hidden;
  color: white;
  background-color: #063f94;
}
</style>
