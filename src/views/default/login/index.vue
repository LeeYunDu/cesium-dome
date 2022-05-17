<template>
  <div class="login-container">
    <div class="white-bg">
      <header class="login-title" />
      <section class="login-form" style="margin-top: 70px;">
        <el-tabs v-model="tabActiveName" @tab-click="handleTabClick">
          <!-- 账号登录-->
          <el-tab-pane label="账号登录" name="first">
            <el-form
              ref="loginForm"
              :model="loginField.loginForm"
              :rules="loginField.loginRules"
              auto-complete="on"
              label-position="left"
              class="login-box"
            >
              <el-form-item prop="username">
                <span class="svg-container">
                  <!-- <svg-icon icon-class="user" /> -->
                  <i class="el-icon-user" style="font-size: 25px; color: #afc1d9;" />
                </span>
                <el-input
                  ref="username"
                  v-model="loginField.loginForm.username"
                  placeholder="请输入用户名"
                  name="username"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />
              </el-form-item>

              <el-tooltip
                v-model="capsTooltip"
                content="Caps lock is On"
                placement="right"
                manual
              >
                <el-form-item prop="password">
                  <span class="svg-container">
                    <!-- <svg-icon icon-class="password" /> -->
                    <i class="el-icon-lock" style="font-size: 25px; color: #afc1d9;" />
                  </span>
                  <el-input
                    ref="password"
                    :key="loginField.passwordType"
                    v-model="loginField.loginForm.password"
                    :type="loginField.passwordType"
                    placeholder="请输入密码"
                    name="password"
                    tabindex="2"
                    auto-complete="on"

                    @blur="capsTooltip = false"
                  />
                  <span class="show-pwd" @click="showPwd">
                    <i class="el-icon-view" />
                  </span>
                </el-form-item>
              </el-tooltip>
              <el-checkbox v-model="loginField.rememberPassword" label="记住密码" @change="doRememberPassword" />
              <!-- <el-checkbox v-model="autoLogin" label="自动登录" @change="doAutoLogin" /> -->
              <!-- <a href="#" class="forget" @click="forgetpass">忘记密码?</a> -->
            </el-form>
            <el-button
              class="login-btn"
              :loading="loginField.loading"
              style="width: 100%;"
              @click.prevent="handleLogin"
            >
              登 录
            </el-button>
          </el-tab-pane>
          <!-- 数字证书登录 -->
          <!-- <el-tab-pane label="数字证书登录" name="second">
            <sslLogin @on-ok="handleSSLSuccess" />
          </el-tab-pane> -->
          <!-- 手机登录 -->
          <!-- <el-tab-pane label="手机登录" name="third">
            <mobileLogin @on-ok="handleMobileSuccess" />
          </el-tab-pane> -->
          <!-- 二维码登录 -->
          <!-- <el-tab-pane label="二维码登录" name="fourth">
            <el-row class="qrTypeSelect">
              <el-col :offset="6" :span="18">
                <el-radio v-model="qrType" label="1">钉钉1.0</el-radio>
                <el-radio v-model="qrType" label="2">钉钉2.0</el-radio>
              </el-col>
            </el-row>
            <erweimaLogin2 v-if="qrType === '2'" @on-ok="handleQrCodeSuccess" />
            <erweimaLogin v-if="qrType === '1'" @on-ok="handleQrCodeSuccess" />
          </el-tab-pane> -->

        </el-tabs>
        <p class="notic">不得在系统上存储、处理和收发涉密、敏感信息！</p>

      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { setCookie, delCookie } from './until'
import { defineComponent, nextTick, reactive, ref, toRefs } from 'vue'
import { userLoginApi } from '@/api/system'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'Login',

  setup() {
    const store = useStore()
    const router = useRouter()
    // 表单验证
    const validateUsername = (rule, value, callback) => {
      if (value === null || value === undefined) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入至少6位的密码'))
      } else {
        callback()
      }
    }
    // 登录所涉及到的字段
    const loginField = reactive({
      loginForm: {
        username: 'admin',
        password: '123456',
        deptId: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false, // 按钮loading
      rememberPassword: false, // 记住密码
      autoLogin: false, // 自动登录
      passwordType: 'password' // 密码是否显示
    })

    const refs = reactive({
      password: null,
      loginForm: null
    })

    const capsTooltip = ref(false)

    // 登录标签页切换
    const tabActiveName = ref('first')
    const handleTabClick = () => {

    }

    // 是否显示密码
    const showPwd = async() => {
      if (loginField.passwordType === 'password') {
        loginField.passwordType = ''
      } else {
        loginField.passwordType = 'password'
      }

      await nextTick();
      (refs.password as any).focus()
    }

    // 账号密码登录
    const handleLogin = () => {
      if (loginField.rememberPassword) {
        // 勾选了记住密码，现在开始写入cookie
        setCookie('username', loginField.loginForm.username, 1440 * 3)
        setCookie('password', loginField.loginForm.password, 1440 * 3)
      } else {
        // 没有勾选记住密码，现在开始删除账号cookie
        delCookie('username')
        delCookie('password')
      }
      (refs.loginForm as any).validate(async valid => {
        if (valid) {
          loginField.loading = true
          // 调用登录接口
          store.dispatch('user/login', loginField.loginForm).then(res => {
            // 登录成功后的逻辑处理
            loginField.loading = false
            // router.push({ path: '' })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    return {
      ...toRefs(refs),
      capsTooltip, handleLogin, loginField, tabActiveName, handleTabClick,
      showPwd
    }
  }
})
</script>
<style lang="scss">
  @import "./login.scss";
</style>

<style lang="scss" scoped>
@import "./login-scoped.scss";
</style>

