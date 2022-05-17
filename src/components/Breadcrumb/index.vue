<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item,index) in levelList"
        :key="item.path"
      >
        <span
          v-if="item.meta.redirect==='noRedirect'||index==levelList.length-1"
          class="no-redirect"
        >
          <!-- <svg-icon
            v-if="item.meta.icon !== '' && item.meta.icon !== ' '"
            :icon-class="item.meta.icon||''"
            class="breadcrumb-svg"
          /> -->
          {{ item.meta.title }}
        </span>
        <a
          v-else
          @click.prevent="handleLink(item)"
        >
          <!-- <svg-icon
            v-if="item.meta.icon !== '' && item.meta.icon !== ' '"
            :icon-class="item.meta.icon||''"
            class="breadcrumb-svg"
          /> -->
          {{ item.meta.title }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title

      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: '首页', icon: 'home' }}].concat(matched)
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },

    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }

      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  padding-top: 10px;
  padding-left: 15px;
  display: block;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  background-color: #f0f0f0;

  .el-breadcrumb__item:last-child {
    .no-redirect {
      font-weight: 700 !important;
      color: #515a6e !important;
    }
  }

  a,
  .no-redirect {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  a {
    color: #515a6e;
    transition: color 0.2s ease-in-out;
    &:hover {
      color: #409eff;
    }
  }

  .no-redirect {
    font-weight: 400;
    color: #999999;
  }

  .breadcrumb-svg {
    margin-right: 4px;
    font-size: 12px;
    line-height: 16px;
  }
}
</style>
