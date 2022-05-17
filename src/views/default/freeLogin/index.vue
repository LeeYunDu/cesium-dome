<template>
  <div />
</template>

<script>
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setToken } from '@/utils/auth' // get token from cookie
import { getSosAuthToken } from '@/api/token'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    if (route.query.encryptionToken) {
      getSosAuthToken({ encryptionToken: route.query['encryptionToken'] }).then(res => {
        setToken(res.data)
        store.dispatch('app/setData', { key: 'freeLogin', value: true })
        // 路由重定向
        const target = route.query.redirect
          ? route.query.redirect
          : '/'
        router.push({
          path: target,
          replace: true
        })
      })
    }
  }
})
</script>

