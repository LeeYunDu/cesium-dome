<template>
  <AccountBackground>
    <LoginComponent
      :login-methods="loginMethods"
      :active-name-prop="activeName"
      @login="loginTemp"
      @tabClick="handleTabClick"
    />
  </AccountBackground>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs } from 'vue'
import AccountBackground from './components/AccountBackground.vue'
import LoginComponent from './components/LoginComponent.vue'
import { removeToken } from '@/utils/auth'
import { useStore } from 'vuex'

import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  components: {
    AccountBackground, LoginComponent
  },
  setup() {
    removeToken() // 清除token

    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const that = reactive({
      loginMethods: store.state.app.loginMethods,
      activeName: store.state.app.loginMethods[0].type
    } as any)

    // 登录逻辑处理
    const loginTemp = (data) => {
      const { username, password } = data
      data.loginType = that.activeName
      // 用户名密码登录方式逻辑处理
      if (that.activeName === 'username') {
        loginSuccess(data)
      }
    }

    // 登录成功
    const loginSuccess = async(data) => {
      await store.dispatch('user/login', data)
      const target:any = route.query.redirect
        ? route.query.redirect
        : '/'
      router.push({
        path: target,
        replace: true
      })
    }

    const handleTabClick = (value) => {
      that.activeName = value
    }
    return {
      ...toRefs(that),
      loginTemp, handleTabClick
    }
  }
})
</script>

<style>

</style>
