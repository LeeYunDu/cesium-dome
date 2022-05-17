<template>
  <div class="login-wrapper">
    <div class="container">
      <!-- tab头 -->
      <div class="tabs-nav-box">
        <div class="tabs-active-bar" :style="tabsStyle" />
        <ul class="tabs-nav-group">
          <li
            v-for="(item, index) in loginMethods"
            :key="index"
            class="tabs-nav-item"
            :class="[`tabs${index}`, activeName === item.type?'is-active':'']"
            @click="handleTabNav($event,item)"
          >
            {{ item.title }}
          </li>
        </ul>
      </div>
      <div class="login-tabs-cover">

        <template v-if="activeName === 'username'">
          <userNameLogin v-bind="$attrs" />
        </template>

        <template v-else-if="activeName === 'zzd-qrcode'">
          <zzdLogin />
        </template>

      </div>

    </div>
  </div>
</template>

<script>

import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import userNameLogin from './usernameLogin.vue'
import zzdLogin from './zzdLogin.vue'
export default defineComponent({
  name: 'LoginComponent',
  components: {
    userNameLogin, zzdLogin
  },
  props: {
    activeNameProp: {
      type: String,
      default: ''
    },
    checked: Boolean,
    loginMethods: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const that = reactive({
      tabsStyle: {},
      code: {
        src: '/code',
        value: '',
        len: 4,
        type: 'image'
      }
    })
    const activeName = computed(() => {
      return props.activeNameProp
    })
    const handleTabNav = (e, item) => {
      ctx.emit('tabClick', item.type)
      that.tabsStyle = { transform: `translateX(${e.target.offsetLeft + 12}px)`,
        width: e.target.offsetWidth - 24 + 'px' }
    }

    onMounted(() => {
      const element = document.querySelector('.tabs0')
      if (element) {
        that.tabsStyle = { transform: `translateX(${element.offsetLeft + 12}px)`,
          width: element.offsetWidth - 24 + 'px' }
      }
    })
    return {
      ...toRefs(that), handleTabNav, activeName
    }
  }
})
</script>

<style lang="scss" scoped>
.fs16 {
  font-size: 16px;
}
.fs14 {
  font-size: 14px;
}
.login-wrapper {
  height: 100%;
  width: 100%;
  .tabs-nav-box {
    width: 100%;
    position: relative;
    .tabs-active-bar {
      position: absolute;
      border-radius: 3px;
      background-color: #2f54eb !important;
      height: 5px !important;
      // z-index: -1;
      bottom: 2px;
      transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      list-style: none;
    }
    .tabs-nav-group {
      width: 100%;
      position: relative;
      display: flex;
      justify-content: space-around;
      list-style: none;
      padding: 0;
      box-sizing: border-box;
    }
    .tabs-nav-item {
      cursor: pointer;
      position: relative;
      font-size: 22px;
      color: #252631;
    }
  }
  .login-tabs-cover {
    padding-top: 32px;
    width: 80%;
    margin: 0 auto;
    min-width: 380px;
  }
  .top {
    font-size: 28px;
    color: #001737;
    text-align: center;
    box-sizing: border-box;
    padding-top: 20px;
    font-weight: 500;
    padding-bottom: 30px;
  }

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
}

.jump-link {
  color: #1458e9;
  cursor: pointer;
  font-size: 14px;
  // border-bottom: 1px solid #1458e9;
  padding-bottom: 4px;
}

@media screen and (max-width: 1600px) {
  .container {
    width: 90% !important;
  }
}
</style>

<style lang="scss" scoped>
.login-tabs-cover {

  ::v-deep .el-tabs__header {
    margin: 0;
  }
  ::v-deep .el-tabs__item {
    height: 30px;
    line-height: 30px;
  }
  ::v-deep .el-tabs__item {
    font-size: 16px !important;
  }
  ::v-deep .is-active {
    color: #333333 !important;
  }
  ::v-deep .el-tabs__active-bar {
    position: absolute;
    border-radius: 3px;
    background-color: #1458e9 !important;
    height: 4px !important;
    z-index: -1;
    bottom: 7px;
  }
  ::v-deep .el-tabs__nav-wrap {
    &::after {
      background-color: transparent;
    }
  }
  ::v-deep .el-tabs__content {
    margin-top: 30px;
  }
  ::v-deep .el-tabs__nav {
    width: 100%;
    display: flex;
  }
  ::v-deep .el-tabs__nav .el-tabs__item {
    flex: 1;
    text-align: center;
  }
  ::v-deep .el-tabs__content {
    overflow: visible;
  }

}
.login-code {
  margin-right: 10px;
}
</style>
