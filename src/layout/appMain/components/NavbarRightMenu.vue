<template>
  <div class="navbar-right-menu right-menu">

    <el-dropdown
      class="right-menu-item hover-effect"
    >
      <div class="avatar-container">
        <img src="@/assets/layout/avatar-default.png" class="user-avatar">
        {{ name }}

        <i class="el-icon-caret-bottom" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <!-- <el-dropdown-item>
            {{ '返回首页' }}
          </el-dropdown-item>
          <el-dropdown-item>
            {{ '个人信息' }}
          </el-dropdown-item>
          <el-dropdown-item>
            {{ '修改密码' }}
          </el-dropdown-item> -->

          <el-dropdown-item divided>
            <span style="display: block;" @click="logout">{{ '退出登录' }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>

    </el-dropdown>

  </div>
</template>

<script lang='ts'>
/**
 * 顶部导航栏的右侧菜单
 */

import { ElMessage } from 'element-plus'
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()
    const logout = () => {
      store.dispatch('user/logout').then((res) => {
        router.push({ path: '/login' })
      })
    }
    const name = computed(() => {
      return store.getters.userInfo.name || ''
    })
    return {
      logout, store, name
    }
  }
})
</script>

<style lang="scss" scoped>
.navbar-right-menu {
  padding-right: 10px;
  &.right-menu {
    float: right;
    height: 100%;
    line-height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #ffffff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          // color: #fff;
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-left: 0;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      font-size: 16px;
      color: white;
      .user-avatar {
        margin-right: 10px;
        cursor: pointer;
        width: 35px;
        height: 35px;
        border-radius: 20px;
      }

      .el-icon-caret-bottom {
        margin-left: 5px;
        cursor: pointer;
        font-size: 12px;
      }
    }
  }
}
.item {
  margin-right: 20px;
  height: calc(100% - 43px);
  width: 64px;
  color: #ffffff;
  line-height: 17px;
  span {
    position: relative;
    top: 0;
    left: 0;
  }
}
</style>
