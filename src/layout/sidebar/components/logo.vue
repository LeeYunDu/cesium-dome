<template>
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <!-- <h1 v-else class="sidebar-title">{{ settings.title }} </h1> -->
        <h1 v-else class="sidebar-title">后台管理平台</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <!-- <h1 class="sidebar-title">{{ settings.title }} </h1> -->
        <h1 class="sidebar-title">后台管理平台</h1>
      </router-link>
    </transition>

  </div>
</template>

<script>

import logo from '@/assets/layout/LOGO.png'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {

      logo,
      str: process.env.VUE_APP_PERSON_TYPE_TITLE
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  // width: 100%;
  // width: 325px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  // border-right: 1px solid rgba(68, 68, 68, 0.1);
  overflow: hidden;

  & .sidebar-logo-link {
    position: absolute;
    z-index: 999;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #ffffff;
      font-weight: 400;
      // line-height: 60px;
      font-size: 20px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: bottom;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }

  & .text-bg {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 65px;
    font-weight: 500;
    font-size: 62px;
    color: #32a6ef;
  }
}
</style>
