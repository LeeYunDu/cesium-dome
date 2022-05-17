<template>
  <div class="qrcode-box">
    <span class="dingdingmsg">IOS移动网络下可能会出现扫码失败</span>
    <div class="qrborder" />
    <div class="ddLoginContainer">
      <iframe
        v-if="zzdQRCodeConfig.qrCodeSrc"
        class="iframe"
        :src="zzdQRCodeConfig.qrCodeSrc"
      />
    </div>
  </div>

</template>

<script>
import { defineComponent, onMounted, onUnmounted, reactive, toRefs } from 'vue'
import { getZZDAppId } from '@/api/user'
import { ElMessage } from 'element-plus'
import Axios from 'axios'
import { useStore } from 'vuex'
import { setToken } from '@/utils/auth'
import * as CryptoJS from 'crypto-js'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const that = reactive({
      zzdQRCodeConfig: {
        appId: '',
        appKey: '',
        appSecret: '',
        qrCodeSrc: ''
      },
      iframeUrl: ''
    })
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    onMounted(() => {
      window.addEventListener('message', function(event) {
        if (event.data.code) {
          QRLogin(event.data.code)
        }
      })
      getZZDAppId().then(res => {
        that.zzdQRCodeConfig = { ...res.data }
      }).catch(() => {
        ElMessage.error('浙政钉二维码生成失败')
      })
    })

    onUnmounted(() => {
      window.removeEventListener('message', () => {})
    })
    const QRLogin = (code) => {
      const data = {
        QRCode: code,
        codeType: 'ZZDQr'
      }
      const type = ''
      const param = ['QRCode']
      const key = 'thanks,pig4cloud'
      const QRData = encryption(data, type, param, key)
      login(process.env.VUE_APP_BASE_API + '/auth/oauth/token', { QRCode: QRData.QRCode, codeType: QRData.codeType, grant_type: 'custom_qr_code', scope: 'server' }).then((res) => {
        // console.log(res, '登录login 获取接口数据')
        setToken(res.data.access_token)
        // 路由重定向
        const target = route.query.redirect
          ? route.query.redirect
          : '/'
        router.push({
          path: target,
          replace: true
        })
      // eslint-disable-next-line handle-callback-err
      }).catch((err) => {
        ElMessage.error('服务器连接失败')
      })
    }

    // 请求方法封装
    const login = (url, params) => {
      return Axios({
        method: 'post',
        url: url,
        params: params,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic UVJDb2RlOnNvcw=='
        }
      })
    }

    /**
    * 加密处理
    * @param {*加密参数} data
    * @param {*加密类型} type
    * @param {*加密参数} param
    * @param {*加密键值} key
    */
    const encryption = (data, type, param, key) => {
      var result = JSON.parse(JSON.stringify(data))
      if (type === 'Base64') {
        param.forEach(ele => {
          result[ele] = btoa(result[ele])
        })
      } else {
        param.forEach(ele => {
          var data = result[ele]
          key = CryptoJS.enc.Latin1.parse(key)
          var iv = key
          // 加密
          var encrypted = CryptoJS.AES.encrypt(
            data,
            key, {
              iv: iv,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.ZeroPadding
            })
          result[ele] = encrypted.toString()
        })
      }
      return result
    }
    return {
      ...toRefs(that)
    }
  }
})
</script>

<style lang='scss'>
.qrcode-box {
  width: 335px;
  height: 400px;
  background: #ffffff;
  border-radius: 6px;
  margin: 0 auto;
  display: flex;
  flex-direction:column;
}
.dingdingmsg {
  font-size: 20px;
  color: #fd7070;

  bottom: 0;
}
.ddLoginContainer {
  margin-top: 35px;

  z-index: 2;
  flex: 1;
  .iframe{
    height: 100%;
    border: none;
  }
}
</style>
