<template>
  <div>
    <form>
      <div class="item">
        <div class="label"><i class="icon-home" /></div>
        <input
          v-model="accountInputObj.username"
          autocomplete="off"
          class="input-cover"
          size="25"
          placeholder="请输入用户名"
          @keyup.enter="login"
        >
      </div>

      <div class="item">
        <div class="label"><i class="icon-pwd" /></div>
        <input

          v-model="accountInputObj.password"
          class="input-cover"
          size="25"
          type="password"
          autocomplete="password"
          placeholder="请输入密码"
          @keyup.enter="login"
        >
      </div>

      <div class="item">
        <div class="label"><i class="icon-code" /></div>
        <input

          v-model="accountInputObj.code"
          :maxlength="code.len"
          class="input-cover"
          size="25"
          placeholder="请输入验证码"
          @keyup.enter="login"
        >
        <div class="login-code">
          <img
            :src="code.src"
            class="login-code-img"
            @click="refreshCode"
          >
        </div>
      </div>

    </form>

    <el-button
      class="submit"
      type="submit"
      @click="login"
    >登录</el-button>

    <div class="login-action-box">
      <!-- <el-checkbox
              :checked="checked"
              @change="$emit('change', $event)"
            ><span class="fs14">下次自动登录</span></el-checkbox> -->
      <!-- <a class="jump-link" @click="resetPwd('haha')">重置密码</a> -->
      <!-- <a class="small_ft ml_10" @click="register">注册</a>>-->
      <!-- <a
        class="jump-link"
        @click="forgetPwd"
      >忘记密码？</a> -->
    </div>
    <div class="floor-text" />
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'

export default defineComponent({
  emits: ['login'],
  setup(props, ctx) {
    const that = reactive({
      // 账号密码登录,手机登录
      accountInputObj: {
        username: '',
        password: '',
        mobile: '',
        SMScode: '',
        picCode: '',
        code: '',
        randomStr: ''
      },
      code: {
        src: '/code',
        value: '',
        len: 4,
        type: 'image'
      },
      codeUrl: process.env.VUE_APP_BASE_API
    })

    const login = () => {
      that.accountInputObj.redomStr = that.accountInputObj.randomStr
      ctx.emit('login', { ...that.accountInputObj })
    }

    // 刷新验证码
    const refreshCode = () => {
      that.accountInputObj.code = ''
      that.accountInputObj.randomStr = randomLenNum(that.code.len, true)
      that.code.type === 'text'
        ? (that.code.value = randomLenNum(that.code.len))
        : (that.code.src = `${that.codeUrl}/code?randomStr=${that.accountInputObj.randomStr}`)
    }
    // 生成随机数
    const randomLenNum = (len, date) => {
      let random = ''
      random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len || 4)
      if (date) random = random + Date.now()
      return random
    }

    onMounted(() => {
      refreshCode()
    })
    return {
      ...toRefs(that), login, refreshCode, randomLenNum
    }
  }
})
</script>

<style lang='scss' scoped>
 .container {
    width: 100%;
    margin: 0 auto;
    position: relative;

    .floor-text {
      margin-top: 25px;
      text-indent: 36px;
      color: #001737;
      font-size: 16px;
    }
    .login-action-box {
      margin-top: 25px;
      display: flex;
      justify-content: flex-end;
    }
    .input-cover::placeholder {
      color: #c0ccda;
      font-size: 20px;
    }
    .input-cover {
      background: none;
      outline: none;
      border: 0;
      width: 100%;
      font-size: 20px;
    }

    .label {
      padding-left: 30px;
      box-sizing: border-box;
      font-size: 16px;
      color: #8392a5;
      flex: 0 0 70px;
      text-align: left;
      margin-top: -2px;
    }

    .item {
      display: flex;
      height: 50px;
      align-items: center;
      margin-top: 28px;
      border-radius: 8px;
      font-size: 16px;
      border: solid 1px #dcd9d9;
      i {
        height: 25px;
        width: 25px;
        display: inline-block;
        margin-top: 5px;
      }
      .icon-home {
        background: url('~@/assets/login/icon_home.png') no-repeat;
        background-size: contain;
        background-position: 50%;
      }
      .icon-pwd {
        background: url('~@/assets/login/icon_pwd.png') no-repeat;
        background-size: contain;
        background-position: 50%;
      }
      .icon-phone {
        background: url('~@/assets/login/icon_phone.png') no-repeat;
        background-size: contain;
        background-position: 50%;
      }
      .icon-code {
        background: url('~@/assets/login/icon_pic.png') no-repeat;
        background-size: contain;
        background-position: 50%;
      }
      .icon-check {
        background: url('~@/assets/login/icon_check.png') no-repeat;
        background-size: contain;
        background-position: 50%;
      }
    }

    .captcha-wrapper {
      margin-top: 30px;
      padding-left: 20px;
      box-sizing: border-box;
      width: 35%;
      height: 60px;
    }
    .img-captcha {
      border: 1px solid #e5e9f2;
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }

    .getcaptcha-button {
      background-color: #fd7070;
      font-size: 20px;
      width: 100%;
      height: 50px;
      font-weight: 100;
      padding: 0;
      text-align: center;
      color: #ffffff;
      border: 0;
    }

    .submit {
      width: 100%;
      margin-top: 40px;
      color: #ffffff;
      cursor: pointer;
      box-shadow: 0 5px 15px 0 rgb(55 81 254 / 50%);
      border-radius: 8px;
      height: 50px;
      font-size: 20px;
      background-color: #2f54eb;
      border: none;
    }
  }
</style>
